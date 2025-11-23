import ShipmentLog from "../models/logs/ShipmentLog.js";
import ObjectModel from "../models/Object.js";
import FoodLog from "../models/logs/FoodLog.js";
import ProducedFood from "../models/logs/ProducedFood.js";
import Client from "../models/Client.js";

const createShipment = async (data) => {
    const { object_id, food_log_id, produced_food_id, client_id } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    if (food_log_id) {
        const food = await FoodLog.findById(food_log_id);
        if (!food) throw new Error("Referenced food log not found");
    }

    if (produced_food_id) {
        const produced = await ProducedFood.findById(produced_food_id);
        if (!produced) throw new Error("Referenced produced food not found");
    }

    if (client_id) {
        const client = await Client.findById(client_id);
        if (!client) throw new Error("Client not found");
    }

    return await ShipmentLog.create(data);
};

const getShipmentsByObject = async (object_id) => {
    return await ShipmentLog.find({ object_id })
        .populate("food_log_id produced_food_id client_id employee_id")
        .sort({ date: -1 });
};

const updateShipment = async (id, updateData) => {
    const updated = await ShipmentLog.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error("Shipment record not found");
    return updated;
};

const deleteShipment = async (id) => {
    const deleted = await ShipmentLog.findByIdAndDelete(id);
    if (!deleted) throw new Error("Shipment record not found");
    return true;
};

export default {
    createShipment,
    getShipmentsByObject,
    updateShipment,
    deleteShipment,
};
