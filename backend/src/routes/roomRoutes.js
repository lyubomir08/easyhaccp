import express from "express";
import roomController from "../controllers/roomController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roomController.createRoom);
router.get("/:object_id", authMiddleware, roomController.getRoomsByObject);
router.put("/edit/:roomId", authMiddleware, roomController.updateRoom);
router.delete("/delete/:roomId", authMiddleware, roomController.deleteRoom);

export default router;
