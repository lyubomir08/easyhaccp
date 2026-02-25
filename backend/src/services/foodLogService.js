import FoodLog from "../models/logs/FoodLog.js";
import ObjectModel from "../models/Object.js";
import buildDateFilter from "../utils/buildDateFilter.js";

function parseDateOnly(value) {
  // очакваме "YYYY-MM-DD" от <input type="date">
  if (!value) return null;

  // ако вече е Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  const s = String(value).trim();

  // YYYY-MM-DD
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;

  const yyyy = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);

  const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
  return isNaN(d.getTime()) ? null : d;
}

const createFoodLog = async (data) => {
  const { object_id, shelf_life } = data;

  const object = await ObjectModel.findById(object_id);
  if (!object) throw new Error("Object not found");

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
  const query = {
    object_id,
    ...buildDateFilter(queryParams, "date"),
  };

  return await FoodLog.find(query)
    .populate("supplier_id")
    .populate("employee_id")
    .sort({ date: -1 });
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