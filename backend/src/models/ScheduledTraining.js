import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        position: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const scheduledTrainingSchema = new mongoose.Schema(
    {
        object_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ObjectModel",
            required: true,
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        lecturer: {
            type: String,
            trim: true,
        },

        planned_date: {
            type: Date,
            required: true,
        },
        participants: [participantSchema],
        status: {
            type: String,
            enum: ["scheduled", "completed"],
            default: "scheduled",
        },
        completed_training_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Training",
            default: null,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("ScheduledTraining", scheduledTrainingSchema);