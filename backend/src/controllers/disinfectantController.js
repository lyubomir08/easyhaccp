import disinfectantService from "../services/disinfectantService.js";
import ObjectModel from "../models/Object.js";
import Disinfectant from "../models/Disinfectant.js";

const createDisinfectant = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add disinfectants to their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only manage disinfectants within their firm" });
        }

        const disinfectant = await disinfectantService.createDisinfectant(req.body);
        res.status(201).json(disinfectant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getDisinfectantsByObject = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view disinfectants in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view disinfectants within their firm" });
        }

        const list = await disinfectantService.getDisinfectantsByObject(object_id);
        res.status(200).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateDisinfectant = async (req, res) => {
    try {
        const { disinfectantId } = req.params;

        const disinfectant = await Disinfectant.findById(disinfectantId).populate("object_id");
        if (!disinfectant) return res.status(404).json({ message: "Disinfectant not found" });

        const object = disinfectant.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update disinfectants in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update disinfectants within their firm" });
        }

        const updated = await disinfectantService.updateDisinfectant(disinfectantId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteDisinfectant = async (req, res) => {
    try {
        const { disinfectantId } = req.params;

        const disinfectant = await Disinfectant.findById(disinfectantId).populate("object_id");
        if (!disinfectant) return res.status(404).json({ message: "Disinfectant not found" });

        const object = disinfectant.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete disinfectants in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete disinfectants within their firm" });
        }

        await disinfectantService.deleteDisinfectant(disinfectantId);
        res.status(200).json({ message: "Disinfectant deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createDisinfectant,
    getDisinfectantsByObject,
    updateDisinfectant,
    deleteDisinfectant,
};
