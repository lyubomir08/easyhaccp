import express from "express";
import personalHygieneController from "../controllers/personalHygieneController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, personalHygieneController.createPersonalHygieneLog);
router.get("/:object_id", authMiddleware, personalHygieneController.getPersonalHygieneLogs);
router.put("/edit/:logId", authMiddleware, personalHygieneController.updatePersonalHygieneLog);
router.delete("/delete/:logId", authMiddleware, personalHygieneController.deletePersonalHygieneLog);

export default router;
