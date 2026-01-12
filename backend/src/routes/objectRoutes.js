import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import objectController from "../controllers/objectController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", objectController.getObjects);
router.get("/:objectId", objectController.getObjectById);
router.put("/edit/:objectId", objectController.updateObject);
router.delete("/delete/:objectId", objectController.deleteObject);

export default router;