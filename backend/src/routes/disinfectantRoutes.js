import express from "express";
import disinfectantController from "../controllers/disinfectantController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, disinfectantController.createDisinfectant);
router.get("/:object_id", authMiddleware, disinfectantController.getDisinfectantsByObject);
router.put("/edit/:disinfectantId", authMiddleware, disinfectantController.updateDisinfectant);
router.delete("/delete/:disinfectantId", authMiddleware, disinfectantController.deleteDisinfectant);

export default router;