import mongoose from "mongoose";

const hygieneLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
    date: { type: Date, required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    disinfectant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Disinfectant" },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
}, { versionKey: false });

hygieneLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("HygieneLog", hygieneLogSchema);
