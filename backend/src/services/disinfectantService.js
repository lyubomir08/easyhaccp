import Disinfectant from "../models/Disinfectant.js";
import ObjectModel from "../models/Object.js";

const createDisinfectant = async (data) => {
    const { object_id } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await Disinfectant.create(data);
};

const getDisinfectantsByObject = async (object_id) => {
    return await Disinfectant.find({ object_id }).sort({ name: 1 });
};

const updateDisinfectant = async (disinfectantId, updateData) => {
    const disinfectant = await Disinfectant.findByIdAndUpdate(disinfectantId, updateData, { new: true });

    if (!disinfectant) throw new Error("Disinfectant not found");
    return disinfectant;
};

const deleteDisinfectant = async (disinfectantId) => {
    const disinfectant = await Disinfectant.findByIdAndDelete(disinfectantId);
    if (!disinfectant) throw new Error("Disinfectant not found");
    return true;
};

export default {
    createDisinfectant,
    getDisinfectantsByObject,
    updateDisinfectant,
    deleteDisinfectant,
};
