import ObjectModel from "../models/Object.js";

const getAllObjects = async () => {
    return await ObjectModel
        .find()
        .populate("firm_id", "name bulstat")
        .sort({ created_at: -1 });
};

const getObjectsByFirm = async (firmId) => {
    return await ObjectModel
        .find({ firm_id: firmId })
        .populate("firm_id", "name bulstat")
        .populate("mol_user_id", "username email")
        .sort({ created_at: -1 });
};

const getObjectById = async (objectId) => {
    const object = await ObjectModel
        .findById(objectId)
        .populate("firm_id", "name bulstat");

    if (!object) throw new Error("Object not found");
    return object;
};

const createObject = async (data) => {
    return await ObjectModel.create(data);
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
    createObject,
    updateObject,
    deleteObject,
};
