import FridgeTemperatureLog from "../models/logs/FridgeTemperatureLog.js";
import ObjectModel from "../models/Object.js";
import Fridge from "../models/Fridge.js";
import Employee from "../models/Employee.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const randomTemp = (min, max) => {
    const val = min + Math.random() * (max - min);
    return Math.round(val * 10) / 10;
};

const parseWorkingHours = (working_hours) => {
    if (!working_hours) return { openH: 8, openM: 0, closeH: 20, closeM: 0 };
    const match = working_hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
    if (!match) return { openH: 8, openM: 0, closeH: 20, closeM: 0 };
    return {
        openH: parseInt(match[1]),
        openM: parseInt(match[2]),
        closeH: parseInt(match[3]),
        closeM: parseInt(match[4]),
    };
};

const autoGenerateTodayLogs = async (object_id) => {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const obj = await ObjectModel.findById(object_id);
    if (!obj) return;

    const { openH, openM, closeH, closeM } = parseWorkingHours(obj.working_hours);

    const morningTime = new Date(now);
    morningTime.setHours(openH + 1, openM, 0, 0);

    const eveningTime = new Date(now);
    eveningTime.setHours(closeH - 1, closeM, 0, 0);

    const fridges = await Fridge.find({ object_id });
    if (fridges.length === 0) return;

    const employees = await Employee.find({ object_id });
    const randomEmployee = employees.length > 0
        ? employees[Math.floor(Math.random() * employees.length)]
        : null;

    for (const fridge of fridges) {
        const min = fridge.norm_min ?? -2;
        const max = fridge.norm_max ?? 4;

        // Сутрешен запис — ако часът е минал и няма запис
        if (now >= morningTime) {
            const morningExists = await FridgeTemperatureLog.findOne({
                fridge_id: fridge._id,
                date: { $gte: todayStart, $lte: morningTime }
            });

            if (!morningExists) {
                await FridgeTemperatureLog.create({
                    object_id,
                    fridge_id: fridge._id,
                    date: morningTime,
                    measured_temp: randomTemp(min, max),
                    employee_id: randomEmployee?._id || undefined,
                    corrective_action: ""
                });
            }
        }

        // Вечерен запис — ако часът е минал и няма запис
        if (now >= eveningTime) {
            const eveningExists = await FridgeTemperatureLog.findOne({
                fridge_id: fridge._id,
                date: { $gt: morningTime, $lte: todayEnd }
            });

            if (!eveningExists) {
                await FridgeTemperatureLog.create({
                    object_id,
                    fridge_id: fridge._id,
                    date: eveningTime,
                    measured_temp: randomTemp(min, max),
                    employee_id: randomEmployee?._id || undefined,
                    corrective_action: ""
                });
            }
        }
    }
};

const createFridgeLog = async (data) => {
    const objectExists = await ObjectModel.findById(data.object_id);
    if (!objectExists) throw new Error("Object not found");
    return await FridgeTemperatureLog.create(data);
};

const getFridgeLogsByObject = async (object_id, queryParams = {}) => {
    await autoGenerateTodayLogs(object_id);

    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date")
    };

    const [logs, total] = await Promise.all([
        FridgeTemperatureLog.find(query)
            .populate("fridge_id")
            .populate("employee_id")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        FridgeTemperatureLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const updateFridgeLog = async (logId, updateData) => {
    const log = await FridgeTemperatureLog.findByIdAndUpdate(logId, updateData, { new: true });
    if (!log) throw new Error("Fridge log not found");
    return log;
};

const deleteFridgeLog = async (logId) => {
    const log = await FridgeTemperatureLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Fridge log not found");
    return true;
};

export default {
    createFridgeLog,
    getFridgeLogsByObject,
    updateFridgeLog,
    deleteFridgeLog,
};