import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    date: { type: Date },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    product_type: { type: String, trim: true },
    batch_number: { type: String, trim: true },
    shelf_life: {type: Date },  
    quantity: { type: Number },
    transport_type: { type: String, trim: true },
    document: { type: String, trim: true },
    image_url: { type: String, trim: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

foodLogSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("FoodLog", foodLogSchema);