import fridgeService from "../services/fridgeService.js";
import ObjectModel from "../models/Object.js";
import Fridge from "../models/Fridge.js";

const createFridge = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add fridges to their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only manage fridges within their firm" });
        }

        const fridge = await fridgeService.createFridge(req.body);
        res.status(201).json(fridge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFridgesByObject = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view fridges in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view fridges within their firm" });
        }

        const fridges = await fridgeService.getFridgesByObject(object_id);
        res.status(200).json(fridges);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateFridge = async (req, res) => {
    try {
        const { fridgeId } = req.params;

        const fridge = await Fridge.findById(fridgeId).populate("object_id");
        if (!fridge) return res.status(404).json({ message: "Fridge not found" });

        const object = fridge.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update fridges in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update fridges within their firm" });
        }

        const updatedFridge = await fridgeService.updateFridge(fridgeId, req.body);
        res.status(200).json(updatedFridge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFridge = async (req, res) => {
    try {
        const { fridgeId } = req.params;

        const fridge = await Fridge.findById(fridgeId).populate("object_id");
        if (!fridge) return res.status(404).json({ message: "Fridge not found" });

        const object = fridge.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete fridges in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete fridges within their firm" });
        }

        await fridgeService.deleteFridge(fridgeId);
        res.status(200).json({ message: "Fridge deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createFridge,
    getFridgesByObject,
    updateFridge,
    deleteFridge,
};
