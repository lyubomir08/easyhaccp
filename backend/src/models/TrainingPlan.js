import mongoose from "mongoose";

const TrainingPlanSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        lecturer: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "",
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("TrainingPlan", TrainingPlanSchema);