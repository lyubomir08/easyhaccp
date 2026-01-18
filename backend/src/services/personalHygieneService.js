import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createPersonalHygieneLog = async (data) => {
    const log = new PersonalHygieneLog(data);
    await log.save();
    return log;
};

const getPersonalHygieneLogsByObject = async (objectId, queryParams) => {
    const query = {
        object_id: objectId,
        ...buildDateFilter(queryParams, "date")
    };

    return await PersonalHygieneLog.find(query)
        .populate("employee_id")
        .sort({ date: -1 });
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
