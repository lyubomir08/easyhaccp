import express from "express";
import fridgeLogController from "../controllers/fridgeLogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, fridgeLogController.createFridgeLog);
router.get("/:object_id", authMiddleware, fridgeLogController.getFridgeLogs);
router.put("/edit/:logId", authMiddleware, fridgeLogController.updateFridgeLog);
router.delete("/delete/:logId", authMiddleware, fridgeLogController.deleteFridgeLog);

export default router;
