import mongoose from "mongoose";

const personalHygieneLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
    date: { type: Date, required: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    health_status: { type: String, enum: ["healthy", "sick"], required: true },
    uniform_status: { type: String, enum: ["clean", "dirty"], required: true }
}, { versionKey: false });

personalHygieneLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("PersonalHygieneLog", personalHygieneLogSchema);
