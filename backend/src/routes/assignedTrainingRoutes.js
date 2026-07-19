import express from "express";
import assignedTrainingController from "../controllers/assignedTrainingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/assign", authMiddleware, authorize("admin"), assignedTrainingController.assignTraining);
router.get("/", authMiddleware, authorize("owner"), assignedTrainingController.getAssignments);
router.patch("/complete/:assignmentId", authMiddleware, authorize("owner"), assignedTrainingController.completeAssignment);
router.get("/plan/:planId", authMiddleware, authorize("admin"), assignedTrainingController.getAssignmentsByPlan);
router.delete("/delete/:assignmentId", authMiddleware, authorize("admin"), assignedTrainingController.deleteAssignment);

export default router;