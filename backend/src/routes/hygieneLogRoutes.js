import express from "express";
import hygieneLogController from "../controllers/hygieneLogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, hygieneLogController.createHygieneLog);
router.get("/:object_id", authMiddleware, hygieneLogController.getHygieneLogs);
router.put("/edit/:logId", authMiddleware, hygieneLogController.updateHygieneLog);
router.delete("/delete/:logId", authMiddleware, hygieneLogController.deleteHygieneLog);

export default router;
