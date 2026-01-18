import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", userController.getUsers);
router.get("/managers", userController.getManagers);
router.get("/:userId", userController.getUserById);
router.put("/edit/:userId", userController.updateUser);
router.delete("/delete/:userId", userController.deleteUser);

router.put("/change-password", userController.changePassword);
router.put("/profile", userController.updateProfile);

export default router;
