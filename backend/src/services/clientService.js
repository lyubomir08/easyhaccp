import Client from "../models/Client.js";
import ObjectModel from "../models/Object.js";

const createClient = async (data) => {
    const { object_id } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    return await Client.create(data);
};

const getClientsByObject = async (object_id) => {
    return await Client.find({ object_id }).sort({ name: 1 });
};

const updateClient = async (clientId, updateData) => {
    const client = await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    if (!client) throw new Error("Client not found");
    return client;
};

const deleteClient = async (clientId) => {
    const client = await Client.findByIdAndDelete(clientId);
    if (!client) throw new Error("Client not found");
    return true;
};

export default {
    createClient,
    getClientsByObject,
    updateClient,
    deleteClient,
};
