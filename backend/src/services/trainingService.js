import Training from "../models/Training.js";
import ObjectModel from "../models/Object.js";

const createTraining = async (data) => {
    const obj = await ObjectModel.findById(data.object_id);
    if (!obj) throw new Error("Object not found");
    return await Training.create(data);
};

const getTrainingsByObject = async (object_id) => {
    return await Training.find({ object_id })
        .populate("participants.employee_id", "first_name last_name position")
        .sort({ date: -1 });
};

const updateTraining = async (id, data) => {
    const t = await Training.findByIdAndUpdate(id, data, { new: true });
    if (!t) throw new Error("Training not found");
    return t;
};

const deleteTraining = async (id) => {
    const t = await Training.findByIdAndDelete(id);
    if (!t) throw new Error("Training not found");
    return true;
};

export default { createTraining, getTrainingsByObject, updateTraining, deleteTraining };