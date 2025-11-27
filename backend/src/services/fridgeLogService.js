import FridgeTemperatureLog from "../models/logs/FridgeTemperatureLog.js";
import ObjectModel from "../models/Object.js";

const createFridgeLog = async (data) => {
    const { object_id } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await FridgeTemperatureLog.create(data);
};

const getFridgeLogsByObject = async (object_id) => {
    return await FridgeTemperatureLog.find({ object_id })
        .populate("fridge_id")    
        .populate("employee_id")   
        .sort({ createdAt: -1 });
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
