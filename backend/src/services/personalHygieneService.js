import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";

const createPersonalHygieneLog = async (data) => {
    const log = new PersonalHygieneLog(data);
    await log.save();
    return log;
};

const getPersonalHygieneLogsByObject = async (objectId) => {
    const logs = await PersonalHygieneLog.find({ object_id: objectId }).sort({ createdAt: -1 });
    return logs;
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
