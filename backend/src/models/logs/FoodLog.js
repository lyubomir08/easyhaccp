import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    date: { type: Date, required: true },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    product_type: { type: String, required: true, trim: true },
    batch_number: { type: String, required: true, trim: true },
    shelf_life: { type: String, required: true, trim: true },  
    quantity: { type: Number, required: true },
    transport_type: { type: String, trim: true },
    document: { type: String, trim: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

foodLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("FoodLog", foodLogSchema);