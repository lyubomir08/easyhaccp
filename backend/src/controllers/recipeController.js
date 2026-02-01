import recipeService from "../services/recipeService.js";
import FoodGroup from "../models/FoodGroup.js";
import ObjectModel from "../models/Object.js";

/* ========= CREATE ========= */
const createRecipe = async (req, res) => {
    try {
        const { food_group_id } = req.body;
        const user = req.user;

        const foodGroup = await FoodGroup.findById(food_group_id);
        if (!foodGroup) {
            return res.status(404).json({ message: "Food group not found" });
        }

        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const recipe = await recipeService.createRecipe(req.body);
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* ========= GET BY FOOD GROUP ========= */
const getRecipesByFoodGroup = async (req, res) => {
    try {
        const { food_group_id } = req.params;
        const user = req.user;

        const foodGroup = await FoodGroup.findById(food_group_id);
        if (!foodGroup) {
            return res.status(404).json({ message: "Food group not found" });
        }

        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const recipes = await recipeService.getRecipesByFoodGroup(food_group_id);
        res.status(200).json(recipes);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* ========= UPDATE ========= */
const updateRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = req.user;

        const recipe = await recipeService.getRecipeById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const foodGroup = await FoodGroup.findById(recipe.food_group_id);
        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedRecipe = await recipeService.updateRecipe(recipeId, req.body);
        res.status(200).json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* ========= DELETE ========= */
const deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = req.user;

        const recipe = await recipeService.getRecipeById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const foodGroup = await FoodGroup.findById(recipe.food_group_id);
        const object = await ObjectModel.findById(foodGroup.object_id);

        if (req.isManager && user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.isOwner && object.firm_id.toString() !== user.firm_id) {
            return res.status(403).json({ message: "Access denied" });
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
