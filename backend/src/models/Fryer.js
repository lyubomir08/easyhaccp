import mongoose from "mongoose";

const fryerSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
    name: { type: String, trim: true }
}, { versionKey: false });

export default mongoose.model("Fryer", fryerSchema);