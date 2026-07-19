import TrainingPlan from "../models/TrainingPlan.js";

export const createPlan = async (data) => {
    return await TrainingPlan.create(data);
};

export const getPlans = async () => {
    return await TrainingPlan.find().sort({ createdAt: -1 });
};

export const getPlanById = async (id) => {
    return await TrainingPlan.findById(id);
};

export const updatePlan = async (id, data) => {
    return await TrainingPlan.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

export const deletePlan = async (id) => {
    return await TrainingPlan.findByIdAndDelete(id);
};