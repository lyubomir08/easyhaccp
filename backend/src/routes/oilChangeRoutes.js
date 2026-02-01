import express from "express";
import fryerOilLogController from "../controllers/oilChangeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, fryerOilLogController.createFryerOilLog);
router.put("/edit/:logId", authMiddleware, fryerOilLogController.updateFryerOilLog);
router.delete("/delete/:logId", authMiddleware, fryerOilLogController.deleteFryerOilLog);
router.get("/:object_id", authMiddleware, fryerOilLogController.getFryerOilLogs);

export default router;