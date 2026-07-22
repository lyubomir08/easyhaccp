import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    position: { type: String, trim: true }
}, { _id: false });

const trainingSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    topic: { type: String, trim: true },
    lecturer: { type: String, trim: true },
    date: { type: Date },
    participants: [participantSchema],
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model("Training", trainingSchema);