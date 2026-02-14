import mongoose from "mongoose";

const recipeIngredientSchema = new mongoose.Schema({
    ingredient: { type: String, trim: true },
    quantity: { type: Number }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
    food_group_id: { type: mongoose.Schema.Types.ObjectId, ref: "FoodGroup", required: true },
    name: { type: String, required: true, trim: true },
    ingredients: [recipeIngredientSchema],
    recipe_number: { type: Number }  
}, { versionKey: false });


recipeSchema.index({ food_group_id: 1, recipe_number: 1 }, { unique: true });

export default mongoose.model("Recipe", recipeSchema);