import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import firmController from "../controllers/firmController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", firmController.getAllFirms);
router.get("/my", firmController.getMyFirm);  
router.get("/:firmId", firmController.getFirmById);
router.put("/edit/:firmId", firmController.updateFirm);
router.delete("/delete/:firmId", firmController.deleteFirm);

export default router;
