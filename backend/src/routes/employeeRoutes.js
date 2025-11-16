import express from "express";
import employeeController from "../controllers/employeeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:objectId", employeeController.getEmployees);
router.post("/", employeeController.addEmployee);
router.put("/:employeeId", employeeController.editEmployee);
router.delete("/:employeeId", employeeController.removeEmployee);

export default router;