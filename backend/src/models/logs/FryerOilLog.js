import mongoose from "mongoose";

const fryerOilLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    fryer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fryer", required: true },
    oil_type: { type: String, trim: true },
    load_datetime: { type: Date },
    load_quantity: { type: Number },
    change_datetime: { type: Date },
    change_quantity: { type: Number },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

fryerOilLogSchema.index({ fryer_id: 1, change_datetime: -1, load_datetime: -1 });

export default mongoose.model("FryerOilLog", fryerOilLogSchema);