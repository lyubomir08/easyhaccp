import shipmentService from "../services/shipmentService.js";
import ObjectModel from "../models/Object.js";
import ShipmentLog from "../models/logs/ShipmentLog.js";

const createShipment = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only add shipments for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only manage shipments within their firm" });

        const shipment = await shipmentService.createShipment(req.body);
        res.status(201).json(shipment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getShipmentsByObject = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id)
            return res.status(403).json({ message: "Managers can only view shipments for their own object" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only view shipments within their firm" });

        const list = await shipmentService.getShipmentsByObject(object_id, req.query);
        res.status(200).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateShipment = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ShipmentLog.findById(id).populate("object_id");
        if (!record) return res.status(404).json({ message: "Shipment record not found" });

        const object = record.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only update their own shipments" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only update shipments within their firm" });

        const updated = await shipmentService.updateShipment(id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteShipment = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await ShipmentLog.findById(id).populate("object_id");
        if (!record) return res.status(404).json({ message: "Shipment record not found" });

        const object = record.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString())
            return res.status(403).json({ message: "Managers can only delete their own shipments" });

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id)
            return res.status(403).json({ message: "Owners can only delete shipments within their firm" });

        await shipmentService.deleteShipment(id);
        res.status(200).json({ message: "Shipment deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createShipment,
    getShipmentsByObject,
    updateShipment,
    deleteShipment,
};
