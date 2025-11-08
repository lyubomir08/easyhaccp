import mongoose from "mongoose";

const fridgeTemperatureLogSchema = new mongoose.Schema({
    fridge_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fridge", required: true },
    date: { type: Date, required: true },
    measured_temp: { type: Number },
    corrective_action: { type: String },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
}, { versionKey: false });

fridgeTemperatureLogSchema.index({ fridge_id: 1, date: -1 });

export default mongoose.model("FridgeTemperatureLog", fridgeTemperatureLogSchema);
