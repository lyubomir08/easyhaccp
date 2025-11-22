import mongoose from "mongoose";

const cookingTempLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    date: { type: Date, required: true },
    food_group_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodGroup", required: true },
    measured_temp: { type: Number, required: true },
    shelf_life: { type: Date },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

cookingTempLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("CookingTempLog", cookingTempLogSchema);