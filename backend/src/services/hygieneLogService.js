import HygieneLog from "../models/logs/HygieneLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createHygieneLog = async (data) => {
    const { object_id } = data;

    const obj = await ObjectModel.findById(object_id);
    if (!obj) throw new Error("Object not found");

    return await HygieneLog.create(data);
};

const getHygieneLogs = async (object_id, queryParams) => {
    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date")
    };

    return await HygieneLog.find(query)
        .populate("room_id")
        .populate("disinfectant_id")
        .populate("employee_id")
        .sort({ date: -1 });
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
