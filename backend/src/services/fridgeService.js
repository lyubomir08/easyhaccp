import Fridge from "../models/Fridge.js";
import ObjectModel from "../models/Object.js";

const createFridge = async (fridgeData) => {
    const { object_id } = fridgeData;
    
    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await Fridge.create(fridgeData);
};

const getFridgesByObject = async (object_id) => {
    return await Fridge.find({ object_id }).sort({ name: 1 });
};

const updateFridge = async (fridgeId, updateData) => {
    const fridge = await Fridge.findByIdAndUpdate(fridgeId, updateData, { new: true });
    if (!fridge) throw new Error("Fridge not found");
    return fridge;
};

const deleteFridge = async (fridgeId) => {
    const fridge = await Fridge.findByIdAndDelete(fridgeId);
    if (!fridge) throw new Error("Fridge not found");
    return true;
};

export default {
    createFridge,
    getFridgesByObject,
    updateFridge,
    deleteFridge,
};
