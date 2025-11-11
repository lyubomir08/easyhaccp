import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/activate-user/:userId", authMiddleware, async (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
}, adminController.activateUser);

export default router;