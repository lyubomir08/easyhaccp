import mongoose from "mongoose";

const fridgeTemperatureLogSchema = new mongoose.Schema({
  object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true }, 
  fridge_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fridge", required: true },
  date: { type: Date, required: true },
  measured_temp: { type: Number, required: true },
  corrective_action: { type: String, trim: true }, 
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, 
  auto_generated: { type: Boolean, default: false }, 
  created_at: { type: Date, default: Date.now }
}, { versionKey: false });

fridgeTemperatureLogSchema.index({ object_id: 1, fridge_id: 1, date: -1 });

export default mongoose.model("FridgeTemperatureLog", fridgeTemperatureLogSchema);
