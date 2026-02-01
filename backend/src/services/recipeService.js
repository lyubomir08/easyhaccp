import Recipe from "../models/Recipe.js";

const createRecipe = async (data) => {
    return await Recipe.create(data);
};

const getRecipesByFoodGroup = async (food_group_id) => {
    return await Recipe.find({ food_group_id });
};

const getRecipeById = async (recipeId) => {
    return await Recipe.findById(recipeId);
};

const updateRecipe = async (recipeId, data) => {
    return await Recipe.findByIdAndUpdate(recipeId, data, { new: true });
};

const deleteRecipe = async (recipeId) => {
    return await Recipe.findByIdAndDelete(recipeId);
};

export default {
    createRecipe,
    getRecipesByFoodGroup,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
};
