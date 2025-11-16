import express from "express";
import foodGroupController from "../controllers/foodGroupController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:objectId", authMiddleware, foodGroupController.createFoodGroup);
router.get("/:objectId", authMiddleware, foodGroupController.getFoodGroupsByObject);
router.put("/edit/:groupId", authMiddleware, foodGroupController.updateFoodGroup);
router.delete("/delete/:groupId", authMiddleware, foodGroupController.deleteFoodGroup);

export default router;