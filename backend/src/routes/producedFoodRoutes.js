import express from "express";
import producedFoodController from "../controllers/producedFoodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, producedFoodController.createProducedFood);
router.get("/:object_id", authMiddleware, producedFoodController.getProducedFoods);
router.put("/edit/:id", authMiddleware, producedFoodController.updateProducedFood);
router.delete("/delete/:id", authMiddleware, producedFoodController.deleteProducedFood);

export default router;