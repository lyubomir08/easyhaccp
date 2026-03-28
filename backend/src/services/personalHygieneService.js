import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createPersonalHygieneLog = async (data) => {
    const log = new PersonalHygieneLog(data);
    await log.save();
    return log;
};

const getPersonalHygieneLogsByObject = async (objectId, queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id: objectId,
        ...buildDateFilter(queryParams, "date")
    };

    const [logs, total] = await Promise.all([
        PersonalHygieneLog.find(query)
            .populate("employee_id")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        PersonalHygieneLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const updatePersonalHygieneLog = async (logId, data) => {
    const updatedLog = await PersonalHygieneLog.findByIdAndUpdate(logId, data, { new: true });
    return updatedLog;
};

const deletePersonalHygieneLog = async (logId) => {
    await PersonalHygieneLog.findByIdAndDelete(logId);
};

export default {
    createPersonalHygieneLog,
    getPersonalHygieneLogsByObject,
    updatePersonalHygieneLog,
    deletePersonalHygieneLog,
};
