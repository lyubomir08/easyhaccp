import mongoose from "mongoose";

const objectSchema = new mongoose.Schema({
    firm_id: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    working_hours: { type: String, trim: true },
    object_type: { type: String, enum: ["retail", "wholesale", "restaurant", "catering"] },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

objectSchema.index({ firm_id: 1 });

export default mongoose.model("Object", objectSchema);