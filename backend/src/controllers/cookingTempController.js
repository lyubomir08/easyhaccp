import cookingTempService from "../services/cookingTempService.js";
import ObjectModel from "../models/Object.js";
import CookingTempLog from "../models/logs/CookingTempLog.js";

const createCookingTempLog = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only add logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only add logs within their firm" });

        const log = await cookingTempService.createCookingTempLog(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getCookingTempLogs = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view logs within their firm" });

        const logs = await cookingTempService.getCookingTempLogsByObject(object_id, req.query);
        res.status(200).json(logs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateCookingTempLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await CookingTempLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Cooking temp log not found" });

        const object = log.object_id;
        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only update their own logs" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only update logs in their firm" });

        const updated = await cookingTempService.updateCookingTempLog(logId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteCookingTempLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await CookingTempLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Cooking temp log not found" });

        const object = log.object_id;
        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete logs within their firm" });

        await cookingTempService.deleteCookingTempLog(logId);
        res.status(200).json({ message: "Cooking temp log deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createCookingTempLog,
    getCookingTempLogs,
    updateCookingTempLog,
    deleteCookingTempLog,
};
