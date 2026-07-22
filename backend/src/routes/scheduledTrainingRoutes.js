import express from "express";
import scheduledTrainingController from "../controllers/scheduledTrainingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/", authMiddleware, authorize("admin"), scheduledTrainingController.createScheduledTraining);
router.get("/", authMiddleware, authorize("admin"), scheduledTrainingController.getScheduledTrainings);
router.get("/:objectId", authMiddleware, authorize("owner", "manager", "admin"), scheduledTrainingController.getScheduledTrainingsByObject);
router.put("/edit/:trainingId", authMiddleware, authorize("admin"), scheduledTrainingController.updateScheduledTraining);
router.delete("/delete/:trainingId", authMiddleware, authorize("admin"), scheduledTrainingController.deleteScheduledTraining);
router.patch("/complete/:trainingId", authMiddleware, authorize("admin", "owner"), scheduledTrainingController.completeScheduledTraining);

export default router;