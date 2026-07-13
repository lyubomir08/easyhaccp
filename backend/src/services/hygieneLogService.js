import HygieneLog from "../models/logs/HygieneLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";
import Room from "../models/Room.js";
import Disinfectant from "../models/Disinfectant.js";
import Employee from "../models/Employee.js";

const parseWorkingHours = (working_hours) => {
    if (!working_hours) return { closeH: 20, closeM: 0 };

    const match = working_hours.match(
        /(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/
    );

    if (!match) return { closeH: 20, closeM: 0 };

    return {
        closeH: Number(match[3]),
        closeM: Number(match[4]),
    };
};

const autoGenerateTodayLogs = async (object_id) => {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const object = await ObjectModel.findById(object_id);
    if (!object) return;

    const { closeH, closeM } = parseWorkingHours(object.working_hours);

    const logTime = new Date(now);
    logTime.setHours(closeH - 1, closeM, 0, 0);

    if (now < logTime) return;

    const rooms = await Room.find({ object_id });
    if (!rooms.length) return;

    const disinfectants = await Disinfectant.find({ object_id });
    if (!disinfectants.length) return;

    const employees = await Employee.find({ object_id });
    if (!employees.length) return;

    for (const room of rooms) {
        const exists = await HygieneLog.findOne({
            object_id,
            room_id: room._id,
            date: {
                $gte: todayStart,
                $lte: todayEnd
            }
        });

        if (exists) continue;

        const randomEmployee =
            employees[Math.floor(Math.random() * employees.length)];

        const randomDisinfectant =
            disinfectants[Math.floor(Math.random() * disinfectants.length)];

        await HygieneLog.create({
            object_id,
            date: logTime,
            room_id: room._id,
            disinfectant_id: randomDisinfectant._id,
            employee_id: randomEmployee._id
        });
        console.log(`[HygieneCron] Автоматичен запис: ${object.name} - ${room.name}`);
    }
};

const createHygieneLog = async (data) => {
    const { object_id } = data;

    const obj = await ObjectModel.findById(object_id);
    if (!obj) throw new Error("Object not found");

    return await HygieneLog.create(data);
};

const getHygieneLogs = async (object_id, queryParams) => {
    await autoGenerateTodayLogs(object_id);
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date")
    };

    const [logs, total] = await Promise.all([
        HygieneLog.find(query)
            .populate("room_id")
            .populate("disinfectant_id")
            .populate("employee_id")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        HygieneLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const getHygieneLogById = async (logId) => {
    const log = await HygieneLog.findById(logId);
    if (!log) throw new Error("Hygiene log not found");
    return log;
};

const updateHygieneLog = async (logId, data) => {
    const log = await HygieneLog.findByIdAndUpdate(logId, data, { new: true });
    if (!log) throw new Error("Hygiene log not found");
    return log;
};

const deleteHygieneLog = async (logId) => {
    const log = await HygieneLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Hygiene log not found");
    return true;
};

export default {
    createHygieneLog,
    getHygieneLogs,
    getHygieneLogById,
    updateHygieneLog,
    deleteHygieneLog,
};
