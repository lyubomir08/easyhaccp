import recipeService from "../services/recipeService.js";
import FoodGroup from "../models/FoodGroup.js";
import ObjectModel from "../models/Object.js";

const createRecipe = async (req, res) => {
    try {
        const { food_group_id } = req.body;
        const user = req.user;

        const foodGroup = await FoodGroup.findById(food_group_id);
        if (!foodGroup) return res.status(404).json({ message: "Food group not found" });

        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only manage recipes in their own object." });
        }
        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Owners can only manage recipes within their firm." });
        }

        const recipe = await recipeService.createRecipe(req.body);
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getRecipesByFoodGroup = async (req, res) => {
    try {
        const { food_group_id } = req.params;
        const user = req.user;

        const foodGroup = await FoodGroup.findById(food_group_id);
        if (!foodGroup) return res.status(404).json({ message: "Food group not found" });

        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only view their own recipes." });
        }
        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Owners can only access recipes in their firm." });
        }

        const recipes = await recipeService.getRecipesByFoodGroup(food_group_id);
        res.status(200).json(recipes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = req.user;

        const recipe = await recipeService.getRecipesByFoodGroup(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const foodGroup = await FoodGroup.findById(recipe.food_group_id);
        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update their own recipes." });
        }
        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Owners can only update recipes within their firm." });
        }

        const updatedRecipe = await recipeService.updateRecipe(recipeId, req.body);
        res.status(200).json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = req.user;

        const recipe = await recipeService.getRecipesByFoodGroup(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const foodGroup = await FoodGroup.findById(recipe.food_group_id);
        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete their own recipes." });
        }
        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete recipes within their firm." });
        }

        await recipeService.deleteRecipe(recipeId);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createRecipe,
    getRecipesByFoodGroup,
    updateRecipe,
    deleteRecipe,
};
