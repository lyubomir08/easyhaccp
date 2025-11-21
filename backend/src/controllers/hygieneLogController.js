import hygieneLogService from "../services/hygieneLogService.js";
import ObjectModel from "../models/Object.js";

const createHygieneLog = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only create logs for their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only create logs within their firm" });
        }

        const log = await hygieneLogService.createHygieneLog(req.body);
        res.status(201).json(log);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getHygieneLogs = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view logs from their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view logs inside their firm" });
        }

        const logs = await hygieneLogService.getHygieneLogs(object_id);
        res.status(200).json(logs);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateHygieneLog = async (req, res) => {
    try {
        const { logId } = req.params;
        const log = await hygieneLogService.getHygieneLogById(logId);

        const object = await ObjectModel.findById(log.object_id);

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update logs from their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update logs inside their firm" });
        }

        const updated = await hygieneLogService.updateHygieneLog(logId, req.body);
        res.status(200).json(updated);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteHygieneLog = async (req, res) => {
    try {
        const { logId } = req.params;
        const log = await hygieneLogService.getHygieneLogById(logId);

        const object = await ObjectModel.findById(log.object_id);

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete logs from their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete logs inside their firm" });
        }

        await hygieneLogService.deleteHygieneLog(logId);
        res.status(200).json({ message: "Hygiene log deleted successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createHygieneLog,
    getHygieneLogs,
    updateHygieneLog,
    deleteHygieneLog,
};
