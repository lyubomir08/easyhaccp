import mongoose from "mongoose";

const firmSchema = new mongoose.Schema({
    bulstat: { type: String, required: true, trim: true },
    vat_registered: { type: Boolean, default: false },
    name: { type: String, required: true, trim: true },
    mol: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

firmSchema.index({ bulstat: 1 });

export default mongoose.model("Firm", firmSchema);