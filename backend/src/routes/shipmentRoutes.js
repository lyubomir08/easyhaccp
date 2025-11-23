import express from "express";
import shipmentController from "../controllers/shipmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, shipmentController.createShipment);
router.get("/:object_id", authMiddleware, shipmentController.getShipmentsByObject);
router.put("/edit/:id", authMiddleware, shipmentController.updateShipment);
router.delete("/delete/:id", authMiddleware, shipmentController.deleteShipment);

export default router;