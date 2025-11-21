import mongoose from "mongoose";

const cookingTemperatureLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    date: { type: Date, required: true },
    food_group_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodGroup" },
    measured_temp: { type: Number },
    shelf_life: { type: Date },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
}, { versionKey: false });

cookingTemperatureLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("CookingTemperatureLog", cookingTemperatureLogSchema);
