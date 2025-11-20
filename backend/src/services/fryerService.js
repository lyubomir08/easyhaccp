import Fryer from "../models/Fryer.js";
import ObjectModel from "../models/Object.js";

const createFryer = async (fryerData) => {
    const { object_id } = fryerData;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await Fryer.create(fryerData);
};

const getFryersByObject = async (object_id) => {
    return await Fryer.find({ object_id }).sort({ name: 1 });
};

const updateFryer = async (fryerId, updateData) => {
    const fryer = await Fryer.findByIdAndUpdate(fryerId, updateData, { new: true });
    if (!fryer) throw new Error("Fryer not found");
    return fryer;
};

const deleteFryer = async (fryerId) => {
    const fryer = await Fryer.findByIdAndDelete(fryerId);
    if (!fryer) throw new Error("Fryer not found");
    return true;
};

export default {
    createFryer,
    getFryersByObject,
    updateFryer,
    deleteFryer,
};
