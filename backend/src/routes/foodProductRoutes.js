import express from "express";
import { getByObject, create, update, remove } from "../controllers/foodProductController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:objectId", authMiddleware, getByObject);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

export default router;
