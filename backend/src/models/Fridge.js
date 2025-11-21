import mongoose from "mongoose";

const fridgeSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    name: { type: String, trim: true },
    norm_min: { type: Number },
    norm_max: { type: Number }
}, { versionKey: false });

export default mongoose.model("Fridge", fridgeSchema);