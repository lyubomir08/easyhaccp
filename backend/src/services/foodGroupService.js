import FoodGroup from "../models/FoodGroup.js";

const createFoodGroup = async (data) => {
    return await FoodGroup.create(data);
};

const getFoodGroupsByObject = async (object_id) => {
    return await FoodGroup.find({ object_id }).sort({ created_at: -1 });
};

const getFoodGroupById = async (groupId) => {
    return await FoodGroup.findById(groupId);
};

const updateFoodGroup = async (groupId, data) => {
    return await FoodGroup.findByIdAndUpdate(groupId, data, { new: true });
};

const deleteFoodGroup = async (groupId) => {
    return await FoodGroup.findByIdAndDelete(groupId);
};

export default {
    createFoodGroup,
    getFoodGroupsByObject,
    getFoodGroupById, 
    updateFoodGroup,
    deleteFoodGroup
};
