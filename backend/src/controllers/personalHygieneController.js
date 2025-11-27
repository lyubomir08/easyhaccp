import personalHygieneService from "../services/personalHygieneService.js";
import ObjectModel from "../models/Object.js";
import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";

const createPersonalHygieneLog = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only add logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only add logs within their firm" });

        const log = await personalHygieneService.createPersonalHygieneLog(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getPersonalHygieneLogs = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view logs within their firm" });

        const logs = await personalHygieneService.getPersonalHygieneLogsByObject(object_id);
        res.status(200).json(logs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updatePersonalHygieneLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await PersonalHygieneLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Personal hygiene log not found" });

        const object = log.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only update logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only update logs within their firm" });

        const updated = await personalHygieneService.updatePersonalHygieneLog(logId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deletePersonalHygieneLog = async (req, res) => {
    try {
        const { logId } = req.params;

        const log = await PersonalHygieneLog.findById(logId).populate("object_id");
        if (!log) return res.status(404).json({ message: "Personal hygiene log not found" });

        const object = log.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete logs for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete logs within their firm" });

        await personalHygieneService.deletePersonalHygieneLog(logId);
        res.status(200).json({ message: "Personal hygiene log deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createPersonalHygieneLog,
    getPersonalHygieneLogs,
    updatePersonalHygieneLog,
    deletePersonalHygieneLog,
};
