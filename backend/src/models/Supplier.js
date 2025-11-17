import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    firm_id: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String },
    goods_type: { type: String, trim: true },
    registration_number: { type: String, trim: true },
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
}, { versionKey: false });

export default mongoose.model("Supplier", supplierSchema);