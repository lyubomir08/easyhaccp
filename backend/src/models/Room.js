import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    name: { type: String, required: true, trim: true }
}, { versionKey: false });

export default mongoose.model("Room", roomSchema);