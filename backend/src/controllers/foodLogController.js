import foodLogService from "../services/foodLogService.js";
import ObjectModel from "../models/Object.js";

const createFoodLog = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add logs to their object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only add logs to their firm" });
        }

        const log = await foodLogService.createFoodLog(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFoodLogs = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view logs from their object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view logs from their firm" });
        }

        const logs = await foodLogService.getFoodLogs(object_id);
        res.status(200).json(logs);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateFoodLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await foodLogService.getFoodLogById(logId);
        const object = await ObjectModel.findById(log.object_id);

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only edit their own object logs" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only edit logs in their firm" });
        }

        const updated = await foodLogService.updateFoodLog(logId, req.body);
        res.status(200).json(updated);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFoodLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await foodLogService.getFoodLogById(logId);
        const object = await ObjectModel.findById(log.object_id);

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete their own logs" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete logs inside their firm" });
        }

        await foodLogService.deleteFoodLog(logId);
        res.status(200).json({ message: "Food log deleted successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createFoodLog,
    getFoodLogs,
    updateFoodLog,
    deleteFoodLog,
};
