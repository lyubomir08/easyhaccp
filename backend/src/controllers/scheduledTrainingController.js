import scheduledTrainingService from "../services/scheduledTrainingService.js";

const createScheduledTraining = async (req, res) => {
    try {
        const training = await scheduledTrainingService.createScheduledTraining({ ...req.body, created_by: req.user.userId, });

        res.status(201).json(training);
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};

const getScheduledTrainings = async (req, res) => {
    try {
        const trainings = await scheduledTrainingService.getScheduledTrainings();

        res.status(200).json(trainings);
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};

const getScheduledTrainingsByObject = async (req, res) => {
    try {
        const trainings = await scheduledTrainingService.getScheduledTrainingsByObject(req.params.objectId);

        res.status(200).json(trainings);
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};

const updateScheduledTraining = async (req, res) => {
    try {
        const training = await scheduledTrainingService.updateScheduledTraining(req.params.trainingId, req.body);

        res.status(200).json(training);
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};

const deleteScheduledTraining = async (req, res) => {
    try {
        await scheduledTrainingService.deleteScheduledTraining(req.params.trainingId);

        res.status(200).json({ message: "Training deleted successfully", });
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};

const completeScheduledTraining = async (req, res) => {
    try {
        const training = await scheduledTrainingService.completeScheduledTraining(req.params.trainingId);

        res.status(200).json(training);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createScheduledTraining,
    getScheduledTrainings,
    getScheduledTrainingsByObject,
    updateScheduledTraining,
    deleteScheduledTraining,
    completeScheduledTraining,
};