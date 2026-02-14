import Recipe from "../models/Recipe.js";

const createRecipe = async (data) => {
    // Auto-assign recipe number based on food_group_id
    const count = await Recipe.countDocuments({ food_group_id: data.food_group_id });
    const recipeNumber = count + 1;
    
    return await Recipe.create({
        ...data,
        recipe_number: recipeNumber
    });
};

const getRecipesByFoodGroup = async (food_group_id) => {
    return await Recipe.find({ food_group_id }).sort({ recipe_number: 1 }); // Sort by recipe number
};

const getRecipeById = async (recipeId) => {
    return await Recipe.findById(recipeId);
};

const updateRecipe = async (recipeId, data) => {
    // Don't allow updating recipe_number
    const { recipe_number, ...updateData } = data;
    return await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true });
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