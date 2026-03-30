import CookingTempLog from "../models/logs/CookingTempLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createCookingTempLog = async (data) => {
    const { object_id } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    return await CookingTempLog.create(data);
};

const getCookingTempLogsByObject = async (object_id, queryParams = {}) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date"),
    };

    const [logs, total] = await Promise.all([
        CookingTempLog.find(query)
            .populate("food_group_id")
            .populate("employee_id")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        CookingTempLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const updateCookingTempLog = async (logId, updateData) => {
    const log = await CookingTempLog.findByIdAndUpdate(
        logId,
        updateData,
        { new: true }
    )
        .populate("food_group_id")
        .populate("employee_id");

    if (!log) throw new Error("Cooking temperature log not found");
    return log;
};

const deleteCookingTempLog = async (logId) => {
    const log = await CookingTempLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Cooking temperature log not found");
    return true;
};

export default {
    createCookingTempLog,
    getCookingTempLogsByObject,
    updateCookingTempLog,
    deleteCookingTempLog,
};
