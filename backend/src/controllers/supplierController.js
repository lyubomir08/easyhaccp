import supplierService from "../services/supplierService.js";
import ObjectModel from "../models/Object.js";
import Supplier from "../models/Supplier.js";

export const createSupplier = async (req, res) => {
    try {
        const { object_id, name, address, goods_type, registration_number } = req.body;
        const user = req.user;

        const object = await ObjectModel.findById(object_id);
        if (!object) {
            return res.status(404).json({ message: "Object not found" });
        }

        if (req.isManager && String(user.objectId) !== String(object_id)) {
            return res.status(403).json({ message: "Managers can only add suppliers to their own object" });
        }

        if (req.isOwner && String(object.firm_id) !== String(user.firmId)) {
            return res.status(403).json({ message: "Owners can only manage suppliers within their firm" });
        }

        const supplier = await supplierService.createSupplier({
            object_id,
            firm_id: object.firm_id,
            name,
            address,
            goods_type,
            registration_number,
        });

        res.status(201).json(supplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getSuppliersByObject = async (req, res) => {
    try {
        const { object_id } = req.params;
        const user = req.user;

        const object = await ObjectModel.findById(object_id);
        if (!object) {
            return res.status(404).json({ message: "Object not found" });
        }

        if (req.isManager && String(user.objectId) !== String(object_id)) {
            return res.status(403).json({ message: "Managers can only view suppliers in their own object" });
        }

        if (req.isOwner && String(object.firm_id) !== String(user.firmId)) {
            return res.status(403).json({ message: "Owners can only view suppliers within their firm" });
        }

        const suppliers = await supplierService.getSuppliersByObject(object_id);
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const user = req.user;

        const supplier = await Supplier.findById(supplierId).populate("object_id");
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const object = supplier.object_id;

        if (req.isManager && String(user.objectId) !== String(object._id)) {
            return res.status(403).json({ message: "Managers can only update suppliers in their own object" });
        }

        if (req.isOwner && String(object.firm_id) !== String(user.firmId)) {
            return res.status(403).json({ message: "Owners can only update suppliers within their firm" });
        }

        const updatedSupplier = await supplierService.updateSupplier(supplierId, req.body);
        res.status(200).json(updatedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const user = req.user;

        const supplier = await Supplier.findById(supplierId).populate("object_id");
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const object = supplier.object_id;

        if (req.isManager && String(user.objectId) !== String(object._id)) {
            return res.status(403).json({ message: "Managers can only delete suppliers in their own object" });
        }

        if (req.isOwner && String(object.firm_id) !== String(user.firmId)) {
            return res.status(403).json({ message: "Owners can only delete suppliers within their firm" });
        }

        await supplierService.deleteSupplier(supplierId);
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createSupplier,
    getSuppliersByObject,
    updateSupplier,
    deleteSupplier,
};
