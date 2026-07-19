import mongoose from "mongoose";

const AssignedTrainingSchema = new mongoose.Schema(
    {
        training_plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingPlan",
            required: true,
        },

        firm_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Firm",
            required: true,
        },

        assigned_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        due_date: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },

        completed_training_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training",
        },

        completed_at: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "AssignedTraining",
    AssignedTrainingSchema
);