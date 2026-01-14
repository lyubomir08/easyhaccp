import objectService from "../services/objectService.js";

const getObjects = async (req, res) => {
    try {
        if (req.isAdmin) {
            const objects = await objectService.getAllObjects();
            return res.status(200).json(objects);
        }

        if (req.isOwner) {
            const objects = await objectService.getObjectsByFirm(req.user.firm_id);
            return res.status(200).json(objects);
        }

        if (req.isManager) {
            const object = await objectService.getObjectById(req.user.object_id);
            return res.status(200).json([object]);
        }

        res.status(403).json({ message: "Access denied" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getObjectById = async (req, res) => {
    try {
        const object = await objectService.getObjectById(req.params.objectId);

        if (req.isOwner && object.firm_id._id.toString() !== req.user.firm_id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (req.isManager && object._id.toString() !== req.user.object_id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(object);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const createObject = async (req, res) => {
    try {
        if (!req.isAdmin && !req.isOwner) {
            return res.status(403).json({ message: "Access denied" });
        }

        const data = {
            ...req.body,
            firm_id: req.isOwner ? req.user.firm_id : req.body.firm_id,
        };

        const object = await objectService.createObject(data);
        res.status(201).json(object);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateObject = async (req, res) => {
    try {
        const object = await objectService.getObjectById(req.params.objectId);

        if (req.isManager && object._id.toString() !== req.user.object_id) {
            return res.status(403).json({ message: "Managers can edit only their object" });
        }

        if (req.isOwner && object.firm_id._id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can edit only objects in their firm" });
        }

        if (req.isAdmin === false && req.isOwner === false && req.isManager === false) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedObject = await objectService.updateObject(
            req.params.objectId,
            req.body
        );

        res.status(200).json(updatedObject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteObject = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }

        await objectService.deleteObject(req.params.objectId);
        res.status(200).json({ message: "Object deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export default {
    getObjects,
    getObjectById,
    createObject,
    updateObject,
    deleteObject,
};
