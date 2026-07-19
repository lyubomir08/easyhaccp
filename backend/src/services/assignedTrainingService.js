import AssignedTraining from "../models/AssignedTraining.js";

const assignTraining = async ({
    trainingPlanId,
    firmIds,
    assignedBy,
    dueDate,
}) => {
    const assignments = [];

    for (const firmId of firmIds) {
        const exists = await AssignedTraining.findOne({
            training_plan_id: trainingPlanId,
            firm_id: firmId,
            status: "pending",
        });

        if (exists) continue;

        assignments.push({
            training_plan_id: trainingPlanId,
            firm_id: firmId,
            assigned_by: assignedBy,
            due_date: dueDate || null,
        });
    }

    if (assignments.length === 0) {
        return [];
    }

    return await AssignedTraining.insertMany(assignments);
};

const getAssignmentsByFirm = async (firmId) => {
    return await AssignedTraining.find({
        firm_id: firmId,
    })
        .populate("training_plan_id")
        .populate("assigned_by", "name")
        .populate("completed_training_id")
        .sort({ createdAt: -1 });
};

const completeAssignment = async (assignmentId, trainingId) => {
    return await AssignedTraining.findByIdAndUpdate(
        assignmentId,
        {
            status: "completed",
            completed_training_id: trainingId,
            completed_at: new Date(),
        },
        {
            new: true,
        }
    );
};

const getAssignmentsByPlan = async (planId) => {
    return await AssignedTraining.find({
        training_plan_id: planId,
    })
        .populate("firm_id", "name")
        .populate("completed_training_id")
        .sort({ createdAt: -1 });
};

const deleteAssignment = async (assignmentId) => {
    const assignment = await AssignedTraining.findByIdAndDelete(assignmentId);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    return true;
};

export default {
    assignTraining,
    getAssignmentsByFirm,
    completeAssignment,
    getAssignmentsByPlan,
    deleteAssignment,
};