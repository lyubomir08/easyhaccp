import Recipe from "../models/Recipe.js";
import FoodGroup from "../models/FoodGroup.js";

const createRecipe = async (recipeData) => {
    const foodGroup = await FoodGroup.findById(recipeData.food_group_id);
    if (!foodGroup) {
        throw new Error("Food group does not exist");
    }

    const recipe = new Recipe(recipeData);
    return await recipe.save();
};

const getRecipesByFoodGroup = async (food_group_id) => {
    return await Recipe.find({ food_group_id });
};

const updateRecipe = async (recipeId, data) => {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, data, { new: true });
    if (!updatedRecipe) throw new Error("Recipe not found");
    return updatedRecipe;
};

const deleteRecipe = async (recipeId) => {
    const recipe = await Recipe.findByIdAndDelete(recipeId);
    if (!recipe) throw new Error("Recipe not found");
    return true;
};

export default {
    createRecipe,
    getRecipesByFoodGroup,
    updateRecipe,
    deleteRecipe,
};
