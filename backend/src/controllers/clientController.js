import clientService from "../services/clientService.js";
import ObjectModel from "../models/Object.js";
import Client from "../models/Client.js";

const createClient = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add clients to their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only add clients to their firm's objects" });
        }

        const client = await clientService.createClient(req.body);
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getClients = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view clients of their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view clients within their firm" });
        }

        const clients = await clientService.getClientsByObject(object_id);
        res.status(200).json(clients);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const client = await Client.findById(clientId).populate("object_id");
        if (!client) return res.status(404).json({ message: "Client not found" });

        const object = client.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update clients of their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update clients within their firm" });
        }

        const updated = await clientService.updateClient(clientId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const client = await Client.findById(clientId).populate("object_id");
        if (!client) return res.status(404).json({ message: "Client not found" });

        const object = client.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete clients of their own object" });
        }

        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete clients within their firm" });
        }

        await clientService.deleteClient(clientId);
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createClient,
    getClients,
    updateClient,
    deleteClient,
};
