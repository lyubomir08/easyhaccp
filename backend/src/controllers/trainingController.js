import trainingService from "../services/trainingService.js";
import ObjectModel from "../models/Object.js";
import Training from "../models/Training.js";

const createTraining = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add trainings for their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only add trainings within their firm" });
        }

        const training = await trainingService.createTraining(req.body);
        res.status(201).json(training);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getTrainings = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view trainings for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view trainings within their firm" });

        const list = await trainingService.getTrainingsByObject(object_id);
        res.status(200).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateTraining = async (req, res) => {
    try {
        const { trainingId } = req.params;

        const training = await Training.findById(trainingId).populate("object_id");
        if (!training) return res.status(404).json({ message: "Training not found" });

        const object = training.object_id;
        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only update their own trainings" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only update trainings in their firm" });

        const updated = await trainingService.updateTraining(trainingId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteTraining = async (req, res) => {
    try {
        const { trainingId } = req.params;

        const training = await Training.findById(trainingId).populate("object_id");
        if (!training) return res.status(404).json({ message: "Training not found" });

        const object = training.object_id;
        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete trainings for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete trainings within their firm" });

        await trainingService.deleteTraining(trainingId);
        res.status(200).json({ message: "Training deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createTraining,
    getTrainings,
    updateTraining,
    deleteTraining,
};
