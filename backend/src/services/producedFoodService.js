import ProducedFood from "../models/logs/ProducedFood.js";
import ObjectModel from "../models/Object.js";
import Recipe from "../models/Recipe.js";

const createProducedFood = async (data) => {
    const { object_id, recipe_id } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    if (recipe_id) {
        const recipeExists = await Recipe.findById(recipe_id);
        if (!recipeExists) throw new Error("Recipe not found");
    }

    return await ProducedFood.create(data);
};

const getProducedFoodsByObject = async (object_id) => {
    return await ProducedFood.find({ object_id })
        .populate("recipe_id ingredient_id")
        .sort({ date: -1 });
};

const updateProducedFood = async (id, updateData) => {
    const updated = await ProducedFood.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error("Produced food record not found");
    return updated;
};

const deleteProducedFood = async (id) => {
    const deleted = await ProducedFood.findByIdAndDelete(id);
    if (!deleted) throw new Error("Produced food record not found");
    return true;
};

export default {
    createProducedFood,
    getProducedFoodsByObject,
    updateProducedFood,
    deleteProducedFood,
};
