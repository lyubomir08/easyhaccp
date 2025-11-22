import express from "express";
import cookingTempController from "../controllers/cookingTempController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, cookingTempController.createCookingTempLog);
router.get("/:object_id", authMiddleware, cookingTempController.getCookingTempLogs);
router.put("/edit/:logId", authMiddleware, cookingTempController.updateCookingTempLog);
router.delete("/delete/:logId", authMiddleware, cookingTempController.deleteCookingTempLog);

export default router;