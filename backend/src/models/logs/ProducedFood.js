import mongoose from "mongoose";

const producedFoodSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "ObjectModel", required: true },
    recipe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    portions: { type: Number },
    ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodGroup" },
    ingredient_quantity: { type: Number },
    ingredient_batch_number: { type: String, trim: true },
    ingredient_shelf_life: { type: Date },
    product_batch_number: { type: String, trim: true },
    product_shelf_life: { type: Date }
}, { versionKey: false });

producedFoodSchema.index({ object_id: 1, date: -1 });

export default mongoose.model("ProducedFood", producedFoodSchema);
