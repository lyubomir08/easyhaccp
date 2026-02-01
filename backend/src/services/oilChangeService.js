import FryerOilLog from "../models/logs/FryerOilLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createFryerOilLog = async (data) => {
    const { object_id } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await FryerOilLog.create(data);
};

const getLogsByObject = async (object_id, queryParams) => {
    const query = {
        object_id,
        ...buildDateFilter(queryParams, "change_datetime")
    };

    return await FryerOilLog.find(query)
        .populate("fryer_id")
        .populate("employee_id")
        .sort({ change_datetime: -1, load_datetime: -1 });
};

const updateFryerOilLog = async (logId, updateData) => {
    const log = await FryerOilLog.findByIdAndUpdate(logId, updateData, { new: true });
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
