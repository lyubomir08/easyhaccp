import express from "express";
import recipeController from "../controllers/recipeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, recipeController.createRecipe);
router.get("/group/:food_group_id", authMiddleware, recipeController.getRecipesByFoodGroup);
router.put("/edit/:recipeId", authMiddleware, recipeController.updateRecipe);
router.delete("/delete/:recipeId", authMiddleware, recipeController.deleteRecipe);

export default router;