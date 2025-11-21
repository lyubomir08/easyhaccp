import express from "express";
import foodLogController from "../controllers/foodLogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, foodLogController.createFoodLog);
router.get("/:object_id", authMiddleware, foodLogController.getFoodLogs);
router.put("/edit/:logId", authMiddleware, foodLogController.updateFoodLog);
router.delete("/edit/:logId", authMiddleware, foodLogController.deleteFoodLog);

export default router;