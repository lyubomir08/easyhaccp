import express from "express";
import supplierController from "../controllers/supplierController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, supplierController.createSupplier);
router.get("/object/:object_id", authMiddleware, supplierController.getSuppliersByObject);
router.put("/edit/:supplierId", authMiddleware, supplierController.updateSupplier);
router.delete("/delete/:supplierId", authMiddleware, supplierController.deleteSupplier);

export default router;
