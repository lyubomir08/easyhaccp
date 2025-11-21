import mongoose from "mongoose";

const foodGroupSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    food_name: { type: String, required: true, trim: true },
    food_type: { type: String, trim: true },
    cooking_temp: { type: Number },
    shelf_life: { type: String },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model("FoodGroup", foodGroupSchema);