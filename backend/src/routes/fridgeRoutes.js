import express from "express";
import fridgeController from "../controllers/fridgeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, fridgeController.createFridge);
router.get("/:object_id", authMiddleware, fridgeController.getFridgesByObject);
router.put("/edit/:fridgeId", authMiddleware, fridgeController.updateFridge);
router.delete("/delete/:fridgeId", authMiddleware, fridgeController.deleteFridge);

export default router;
