import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.use((req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Admins only" });
    }
    next();
});

router.get("/inactive-users", adminController.getInactiveUsers);
router.put("/activate-user/:userId", adminController.activateUser);

router.get("/inactive-firms", adminController.getInactiveFirms);
router.put("/activate-firm/:firmId", adminController.activateFirm);

router.post("/firms/:firmId/objects", adminController.addObjectToFirm);
router.post("/firms/:firmId/users", adminController.addUserToFirm);

export default router;