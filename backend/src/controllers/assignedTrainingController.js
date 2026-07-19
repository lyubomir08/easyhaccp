import assignedTrainingService from "../services/assignedTrainingService.js";

const assignTraining = async (req, res) => {
    try {
        const { trainingPlanId, firmIds, dueDate } = req.body;

        if (!trainingPlanId) {
            return res.status(400).json({
                message: "Липсва план за обучение.",
            });
        }

        if (!firmIds || firmIds.length === 0) {
            return res.status(400).json({
                message: "Не са избрани фирми.",
            });
        }

        const assignments =
            await assignedTrainingService.assignTraining({
                trainingPlanId,
                firmIds,
                assignedBy: req.user.userId,
                dueDate,
            });

        res.status(201).json(assignments);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const assignments =
            await assignedTrainingService.getAssignmentsByFirm(
                req.user.firm_id
            );

        res.status(200).json(assignments);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

const completeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { trainingId } = req.body;

        const assignment =
            await assignedTrainingService.completeAssignment(
                assignmentId,
                trainingId
            );

        res.status(200).json(assignment);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

const getAssignmentsByPlan = async (req, res) => {
    try {
        const { planId } = req.params;

        const assignments =
            await assignedTrainingService.getAssignmentsByPlan(planId);

        res.status(200).json(assignments);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        await assignedTrainingService.deleteAssignment(assignmentId);

        res.status(200).json({
            message: "Assignment deleted successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

export default {
    assignTraining,
    getAssignments,
    completeAssignment,
    getAssignmentsByPlan,
    deleteAssignment,
};