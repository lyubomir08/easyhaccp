import fridgeLogService from "../services/fridgeLogService.js";
import ObjectModel from "../models/Object.js";
import FridgeLog from "../models/logs/FridgeLog.js";

const createFridgeLog = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only add logs to their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only add logs within their firm" });

        const log = await fridgeLogService.createFridgeLog(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFridgeLogs = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view logs within their firm" });

        const logs = await fridgeLogService.getFridgeLogsByObject(object_id);
        res.status(200).json(logs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateFridgeLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await FridgeLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Fridge log not found" });

        const object = log.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only update logs in their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only update logs within their firm" });

        const updated = await fridgeLogService.updateFridgeLog(logId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFridgeLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await FridgeLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Fridge log not found" });

        const object = log.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete logs in their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete logs within their firm" });

        await fridgeLogService.deleteFridgeLog(logId);
        res.status(200).json({ message: "Fridge log deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createFridgeLog,
    getFridgeLogs,
    updateFridgeLog,
    deleteFridgeLog,
};
