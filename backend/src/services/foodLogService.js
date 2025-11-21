import FoodLog from "../models/logs/FoodLog.js";
import ObjectModel from "../models/Object.js";

const createFoodLog = async (data) => {
    const { object_id } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    return await FoodLog.create(data);
};

const getFoodLogs = async (object_id, startDate, endDate) => {
    const query = { object_id };

    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    }

    return await FoodLog.find(query)
        .populate("supplier_id")
        .populate("employee_id")
        .sort({ date: -1 });
};

const getFoodLogById = async (logId) => {
    const log = await FoodLog.findById(logId);
    if (!log) throw new Error("Food log not found");
    return log;
};

const updateFoodLog = async (logId, updateData) => {
    const log = await FoodLog.findByIdAndUpdate(logId, updateData, { new: true });
    if (!log) throw new Error("Food log not found");
    return log;
};

const deleteFoodLog = async (logId) => {
    const log = await FoodLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Food log not found");
    return true;
};

export default {
    createFoodLog,
    getFoodLogs,
    getFoodLogById,
    updateFoodLog,
    deleteFoodLog,
};
