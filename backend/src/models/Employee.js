import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    position: { type: String, trim: true },
    health_card_expiry: { type: Date },
    active: { type: Boolean, default: true }
}, { versionKey: false });

employeeSchema.index({ object_id: 1 });

export default mongoose.model("Employee", employeeSchema);