import Supplier from "../models/Supplier.js";
import ObjectModel from "../models/Object.js";

const createSupplier = async (supplierData) => {
    const { object_id } = supplierData;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await Supplier.create(supplierData);
};

const getSuppliersByObject = async (object_id) => {
    return await Supplier.find({ object_id }).sort({ name: 1 });
};

const updateSupplier = async (supplierId, updateData) => {
    const supplier = await Supplier.findByIdAndUpdate(supplierId, updateData, { new: true });
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
};

const deleteSupplier = async (supplierId) => {
    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier) throw new Error("Supplier not found");
    return true;
};

export default {
    createSupplier,
    getSuppliersByObject,
    updateSupplier,
    deleteSupplier,
};
