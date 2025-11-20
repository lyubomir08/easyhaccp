import Room from "../models/Room.js";
import ObjectModel from "../models/Object.js";

const createRoom = async (roomData) => {
    const { object_id } = roomData;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    return await Room.create(roomData);
};

const getRoomsByObject = async (object_id) => {
    return await Room.find({ object_id }).sort({ name: 1 });
};

const updateRoom = async (roomId, updateData) => {
    const room = await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    if (!room) throw new Error("Room not found");
    return room;
};

const deleteRoom = async (roomId) => {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) throw new Error("Room not found");
    return true;
};

export default {
    createRoom,
    getRoomsByObject,
    updateRoom,
    deleteRoom,
};
