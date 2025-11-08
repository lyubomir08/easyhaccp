import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
    date: { type: Date, required: true },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    product_type: { type: String, trim: true },
    batch_number: { type: String, trim: true },
    shelf_life: { type: Date },
    quantity: { type: Number },
    transport_type: { type: String, trim: true },
    document: { type: String, trim: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
}, { versionKey: false });

foodLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("FoodLog", foodLogSchema);
