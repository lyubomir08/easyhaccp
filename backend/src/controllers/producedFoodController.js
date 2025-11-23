import producedFoodService from "../services/producedFoodService.js";
import ObjectModel from "../models/Object.js";
import ProducedFood from "../models/logs/ProducedFood.js";

const createProducedFood = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only add records to their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only manage within their firm" });

        const record = await producedFoodService.createProducedFood(req.body);
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getProducedFoods = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view their own object data" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view data within their firm" });

        const list = await producedFoodService.getProducedFoodsByObject(object_id);
        res.status(200).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateProducedFood = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ProducedFood.findById(id).populate("object_id");
        if (!record) return res.status(404).json({ message: "Record not found" });

        const object = record.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only edit records from their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only edit records within their firm" });

        const updated = await producedFoodService.updateProducedFood(id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProducedFood = async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await ProducedFood.findById(id).populate("object_id");
        if (!record) return res.status(404).json({ message: "Record not found" });

        const object = record.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete records from their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete records within their firm" });

        await producedFoodService.deleteProducedFood(id);
        res.status(200).json({ message: "Produced food record deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createProducedFood,
    getProducedFoods,
    updateProducedFood,
    deleteProducedFood,
};
