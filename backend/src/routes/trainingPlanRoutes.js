import express from "express";
import trainingPlanController from "../controllers/trainingPlanController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/", authMiddleware, authorize("admin"), trainingPlanController.createPlan);
router.get("/", authMiddleware, authorize("admin"), trainingPlanController.getPlans);
router.get("/:planId", authMiddleware, authorize("admin"), trainingPlanController.getPlanById);
router.put("/edit/:planId", authMiddleware, authorize("admin"), trainingPlanController.updatePlan);
router.delete("/delete/:planId", authMiddleware, authorize("admin"), trainingPlanController.deletePlan);

export default router;