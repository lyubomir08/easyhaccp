import Recipe from "../models/Recipe.js";

const createRecipe = async (data) => {
    // Глобален recipe_number - взима максималния от ВСИЧКИ рецепти
    const last = await Recipe.findOne()
        .sort({ recipe_number: -1 })
        .select("recipe_number");

    const recipeNumber = last ? last.recipe_number + 1 : 1;

    return await Recipe.create({
        ...data,
        recipe_number: recipeNumber
    });
};

const getRecipesByFoodGroup = async (food_group_id) => {
    return await Recipe.find({ food_group_id }).sort({ recipe_number: 1 });
};

const getRecipeById = async (recipeId) => {
    return await Recipe.findById(recipeId);
};

const updateRecipe = async (recipeId, data) => {
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