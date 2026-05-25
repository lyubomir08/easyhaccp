import mongoose from "mongoose";

const foodProductSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    name: { type: String, required: true, trim: true },
}, { versionKey: false });

foodProductSchema.index({ object_id: 1 });

export default mongoose.model("FoodProduct", foodProductSchema);
