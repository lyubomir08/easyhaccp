import ShipmentLog from "../models/logs/ShipmentLog.js";
import ObjectModel from "../models/Object.js";
import FoodLog from "../models/logs/FoodLog.js";
import ProducedFood from "../models/logs/ProducedFood.js";
import Client from "../models/Client.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const createShipment = async (data) => {
    const { object_id, food_log_id, produced_food_id, client_id, quantity } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    const qty = Number(quantity);
    if (!qty || qty <= 0) throw new Error("Невалидно количество");

    if (!!food_log_id === !!produced_food_id) {
        throw new Error("Трябва да изберете или храна (3.3.1), или готова храна (3.3.7)");
    }

    let food = null;
    let produced = null;

    if (food_log_id) {
        food = await FoodLog.findById(food_log_id);
        if (!food) throw new Error("Referenced food log not found");
        const available = Number(food.quantity || 0);
        if (available < qty) {
            throw new Error(`Недостатъчно количество. Налични: ${available}, искани: ${qty}`);
        }
    }

    if (produced_food_id) {
        produced = await ProducedFood.findById(produced_food_id);
        if (!produced) throw new Error("Referenced produced food not found");
        const availablePortions = Number(produced.portions || 0);
        if (availablePortions < qty) {
            throw new Error(`Недостатъчно порции. Налични: ${availablePortions}, искани: ${qty}`);
        }
    }

    if (client_id) {
        const client = await Client.findById(client_id);
        if (!client) throw new Error("Client not found");
    }

    if (food) {
        food.quantity = Number(food.quantity) - qty;
        await food.save();
    }

    if (produced) {
        produced.portions = Number(produced.portions) - qty;
        await produced.save();
    }

    return await ShipmentLog.create(data);
};

const getShipmentsByObject = async (object_id, queryParams) => {
    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date")
    };

    return await ShipmentLog.find(query)
        .populate("food_log_id")
        .populate({
            path: "produced_food_id",
            populate: { path: "recipe_id", select: "name recipe_number" }
        })
        .populate("client_id")
        .populate("employee_id")
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