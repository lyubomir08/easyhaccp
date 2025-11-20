import fryerService from "../services/fryerService.js";
import ObjectModel from "../models/Object.js";
import Fryer from "../models/Fryer.js";

const createFryer = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add fryers to their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only manage fryers within their firm" });
        }

        const fryer = await fryerService.createFryer(req.body);
        res.status(201).json(fryer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFryersByObject = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view fryers in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view fryers within their firm" });
        }

        const fryers = await fryerService.getFryersByObject(object_id);
        res.status(200).json(fryers);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateFryer = async (req, res) => {
    try {
        const { fryerId } = req.params;

        const fryer = await Fryer.findById(fryerId).populate("object_id");
        if (!fryer) return res.status(404).json({ message: "Fryer not found" });

        const object = fryer.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update fryers in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update fryers within their firm" });
        }

        const updatedFryer = await fryerService.updateFryer(fryerId, req.body);
        res.status(200).json(updatedFryer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFryer = async (req, res) => {
    try {
        const { fryerId } = req.params;

        const fryer = await Fryer.findById(fryerId).populate("object_id");
        if (!fryer) return res.status(404).json({ message: "Fryer not found" });

        const object = fryer.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete fryers in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete fryers within their firm" });
        }

        await fryerService.deleteFryer(fryerId);
        res.status(200).json({ message: "Fryer deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createFryer,
    getFryersByObject,
    updateFryer,
    deleteFryer,
};
