import FoodLog from "../models/logs/FoodLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

function parseDateOnly(value) {
    if (!value) return null;

    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }

    const s = String(value).trim();

    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;

    const yyyy = Number(m[1]);
    const mm = Number(m[2]);
    const dd = Number(m[3]);

    const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
}

const createFoodLog = async (data) => {
    const { object_id, shelf_life, image_url } = data;

    const object = await ObjectModel.findById(object_id);
    if (!object) throw new Error("Object not found");

    if (["retail", "wholesale"].includes(object.object_type)) {
        if (!image_url) {
            throw new Error("Снимката е задължителна за този тип обект");
        }

        return await FoodLog.create({
            object_id,
            image_url,
        });
    }

    const shelfLifeDate = parseDateOnly(shelf_life);
    if (!shelfLifeDate) {
        throw new Error("Невалиден срок на годност. Ползвай дата: YYYY-MM-DD");
    }

    return await FoodLog.create({
        ...data,
        shelf_life: shelfLifeDate,
    });
};

const getFoodLogs = async (object_id, queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date"),
    };

    const [logs, total] = await Promise.all([
        FoodLog.find(query)
            .populate("supplier_id")
            .populate("employee_id")
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit),
        FoodLog.countDocuments(query)
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const getFoodLogById = async (logId) => {
    const log = await FoodLog.findById(logId);
    if (!log) throw new Error("Food log not found");
    return log;
};

const updateFoodLog = async (logId, updateData) => {
    if (updateData.shelf_life !== undefined) {
        const shelfLifeDate = parseDateOnly(updateData.shelf_life);
        if (!shelfLifeDate) {
            throw new Error("Невалиден срок на годност. Ползвай дата: YYYY-MM-DD");
        }
        updateData.shelf_life = shelfLifeDate;
    }

    const log = await FoodLog.findByIdAndUpdate(logId, updateData, { new: true });
    if (!log) throw new Error("Food log not found");
    return log;
};

const deleteFoodLog = async (logId) => {
    const log = await FoodLog.findByIdAndDelete(logId);
    if (!log) throw new Error("Food log not found");
    return true;
};

export default {
    createFoodLog,
    getFoodLogs,
    getFoodLogById,
    updateFoodLog,
    deleteFoodLog,
};