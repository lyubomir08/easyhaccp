import express from "express";
import trainingController from "../controllers/trainingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, trainingController.createTraining);
router.get("/:object_id", authMiddleware, trainingController.getTrainings);
router.put("/edit/:trainingId", authMiddleware, trainingController.updateTraining);
router.delete("/delete/:trainingId", authMiddleware, trainingController.deleteTraining);

export default router;