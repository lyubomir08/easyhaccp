import express from "express";
import clientController from "../controllers/clientController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, clientController.createClient);
router.get("/:object_id", authMiddleware, clientController.getClients);
router.put("/edit/:clientId", authMiddleware, clientController.updateClient);
router.delete("/delete/:clientId", authMiddleware, clientController.deleteClient);

export default router;
