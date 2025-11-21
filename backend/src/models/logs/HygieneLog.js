import mongoose from "mongoose";

const hygieneLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    date: { type: Date, required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    disinfectant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Disinfectant", required: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

hygieneLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("HygieneLog", hygieneLogSchema);
