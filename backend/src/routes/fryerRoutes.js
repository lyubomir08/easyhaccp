import express from "express";
import fryerController from "../controllers/fryerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, fryerController.createFryer);
router.get("/:object_id", authMiddleware, fryerController.getFryersByObject);
router.put("/edit/:fryerId", authMiddleware, fryerController.updateFryer);
router.delete("/delete/:fryerId", authMiddleware, fryerController.deleteFryer);

export default router;