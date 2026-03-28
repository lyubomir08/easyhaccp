import express from "express";
import multer from "multer";
import foodLogController from "../controllers/foodLogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("image"), foodLogController.createFoodLog);
router.get("/:object_id", authMiddleware, foodLogController.getFoodLogs);
router.put("/edit/:logId", authMiddleware, foodLogController.updateFoodLog);
router.delete("/delete/:logId", authMiddleware, foodLogController.deleteFoodLog);

export default router;