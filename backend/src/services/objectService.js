import ObjectModel from "../models/Object.js";

const getAllObjects = async () => {
    return await ObjectModel
        .find()
        .populate("firm_id", "name bulstat");
};

const getObjectsByFirm = async (firmId) => {
    return await ObjectModel
        .find({ firm_id: firmId })
        .populate("firm_id", "name bulstat");
};

const getObjectById = async (objectId) => {
    const object = await ObjectModel
        .findById(objectId)
        .populate("firm_id", "name bulstat");

    if (!object) throw new Error("Object not found");
    return object;
};

const updateObject = async (objectId, updateData) => {
    const object = await ObjectModel.findByIdAndUpdate(
        objectId,
        updateData,
        { new: true }
    );

    if (!object) throw new Error("Object not found");
    return object;
};

const deleteObject = async (objectId) => {
    const object = await ObjectModel.findByIdAndDelete(objectId);
    if (!object) throw new Error("Object not found");
    return true;
};

export default {
    getAllObjects,
    getObjectsByFirm,
    getObjectById,
    updateObject,
    deleteObject,
};
