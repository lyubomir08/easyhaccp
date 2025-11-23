import mongoose from "mongoose";

const shipmentLogSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    food_log_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodLog" },
    produced_food_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProducedFood" },
    quantity: { type: Number, required: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    document: { type: String, trim: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

shipmentLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("ShipmentLog", shipmentLogSchema);