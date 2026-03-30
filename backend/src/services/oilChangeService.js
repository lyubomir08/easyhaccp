import FryerOilLog from "../models/logs/FryerOilLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createFryerOilLog = async (data) => {
    const { object_id } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await FryerOilLog.create(data);
};

const getLogsByObject = async (object_id, queryParams = {}) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id,
        ...buildDateFilter(queryParams, "change_datetime")
    };

    const [logs, total] = await Promise.all([
        FryerOilLog.find(query)
            .populate("fryer_id")
            .populate("employee_id")
            .sort({ change_datetime: -1, load_datetime: -1 })
            .skip(skip)
            .limit(limit),
        FryerOilLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const updateFryerOilLog = async (logId, updateData) => {
    const log = await FryerOilLog.findByIdAndUpdate(logId, updateData, { new: true })
        .populate("fryer_id")
        .populate("employee_id");

    if (!log) throw new Error("Oil log not found");
    return log;
};

const deleteFryerOilLog = async (logId) => {
    const log = await FryerOilLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Oil log not found");
    return true;
};

export default {
    createFryerOilLog,
    getLogsByObject,
    updateFryerOilLog,
    deleteFryerOilLog,
};