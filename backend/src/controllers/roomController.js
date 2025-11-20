import roomService from "../services/roomService.js";
import ObjectModel from "../models/Object.js";
import Room from "../models/Room.js";

const createRoom = async (req, res) => {
    try {
        const { object_id } = req.body;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only add rooms to their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only manage rooms within their firm" });
        }

        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getRoomsByObject = async (req, res) => {
    try {
        const { object_id } = req.params;

        const object = await ObjectModel.findById(object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (req.isManager && req.user.object_id !== object_id) {
            return res.status(403).json({ message: "Managers can only view rooms in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only view rooms within their firm" });
        }

        const rooms = await roomService.getRoomsByObject(object_id);
        res.status(200).json(rooms);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId).populate("object_id");
        if (!room) return res.status(404).json({ message: "Room not found" });

        const object = room.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only update rooms in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only update rooms within their firm" });
        }

        const updatedRoom = await roomService.updateRoom(roomId, req.body);
        res.status(200).json(updatedRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId).populate("object_id");
        if (!room) return res.status(404).json({ message: "Room not found" });

        const object = room.object_id;

        if (req.isManager && req.user.object_id !== object._id.toString()) {
            return res.status(403).json({ message: "Managers can only delete rooms in their own object" });
        }
        if (req.isOwner && object.firm_id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "Owners can only delete rooms within their firm" });
        }

        await roomService.deleteRoom(roomId);
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createRoom,
    getRoomsByObject,
    updateRoom,
    deleteRoom,
};
