import Training from "../models/Training.js";
import ObjectModel from "../models/Object.js";

const createTraining = async (data) => {
    const { object_id } = data;
    
    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    return await Training.create(data);
};

const getTrainingsByObject = async (object_id) => {
    return await Training.find({ object_id })
        .populate("participants.employee_id")
        .sort({ date: -1 });
};

const updateTraining = async (trainingId, updateData) => {
    const training = await Training.findByIdAndUpdate(trainingId, updateData, { new: true });
    if (!training) throw new Error("Training not found");
    return training;
};

const deleteTraining = async (trainingId) => {
    const training = await Training.findByIdAndDelete(trainingId);
    if (!training) throw new Error("Training not found");
    return true;
};

export default {
    createTraining,
    getTrainingsByObject,
    updateTraining,
    deleteTraining,
};
