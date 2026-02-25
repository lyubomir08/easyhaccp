import ProducedFood from "../models/logs/ProducedFood.js";
import FoodLog from "../models/logs/FoodLog.js"; // <-- смени ако пътя е друг
import ObjectModel from "../models/Object.js";
import Recipe from "../models/Recipe.js";
import buildDateFilter from "../utils/buildDateFilter.js";

const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Взима FIFO списък с наличности за дадена съставка + сумата на наличното
 */
async function getAvailabilityFIFO({ objectId, ingredientName }) {
    const target = norm(ingredientName);

    const logs = await FoodLog.find({
        object_id: objectId,
        quantity: { $gt: 0 }
    }).sort({ date: 1, created_at: 1 });

    const matching = logs.filter(l => norm(l.product_type) === target);

    const total = matching.reduce((sum, l) => sum + Number(l.quantity || 0), 0);
    return { total, matching };
}

/**
 * Реално FIFO вадене от подадените matching логове
 * (Тук НЕ проверява достатъчност – това вече е проверено предварително)
 */
async function deductFromLogsFIFO({ matchingLogs, gramsNeeded }) {
    let remaining = gramsNeeded;

    for (const l of matchingLogs) {
        if (remaining <= 0) break;

        const available = Number(l.quantity || 0);
        if (available <= 0) continue;

        const take = Math.min(available, remaining);
        l.quantity = available - take;
        await l.save();

        remaining -= take;
    }

    // ако стигне дотук с remaining > 0 значи някой е изконсумирал между check и deduct
    if (remaining > 0) {
        throw new Error(`Количеството се промени. Липсват: ${remaining} гр. Опитай пак.`);
    }
}

const createProducedFood = async (data) => {
    const { object_id, recipe_id, portions } = data;

    const objectExists = await ObjectModel.findById(object_id);
    if (!objectExists) throw new Error("Object not found");

    if (!recipe_id) throw new Error("Recipe not found");
    const recipe = await Recipe.findById(recipe_id);
    if (!recipe) throw new Error("Recipe not found");

    const portionsNum = Number(portions);
    if (!portionsNum || portionsNum <= 0) {
        throw new Error("Моля, въведете валиден брой порции (иначе няма как да се намалят наличностите).");
    }

    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

    // ====== 1) ПЪРВО: проверка дали стига за ВСИЧКИ съставки ======
    // preparePlan: за всяка съставка пазим gramsNeeded + matching logs (FIFO)
    const plan = [];
    const shortages = [];

    for (const ing of ingredients) {
        const ingredientName = ing.ingredient;
        const gramsPerPortion = Number(ing.quantity || 0);
        if (!ingredientName || gramsPerPortion <= 0) continue;

        const gramsNeeded = gramsPerPortion * portionsNum;

        const { total, matching } = await getAvailabilityFIFO({
            objectId: object_id,
            ingredientName
        });

        if (total < gramsNeeded) {
            shortages.push({
                ingredientName,
                needed: gramsNeeded,
                available: total,
                missing: gramsNeeded - total
            });
        }

        plan.push({
            ingredientName,
            gramsNeeded,
            matchingLogs: matching
        });
    }

    // Ако има липси -> НЕ вадим нищо, директно грешка
    if (shortages.length > 0) {
        const msg = shortages
            .map(s => `${s.ingredientName}: нужни ${s.needed} гр, налични ${s.available} гр (липсват ${s.missing} гр)`)
            .join(" | ");
        throw new Error(`Недостатъчни наличности: ${msg}`);
    }

    // ====== 2) ВТОРО: реалното намаляване (FIFO) ======
    for (const item of plan) {
        await deductFromLogsFIFO({
            matchingLogs: item.matchingLogs,
            gramsNeeded: item.gramsNeeded
        });
    }

    // ====== 3) Накрая: запис на produced food ======
    return await ProducedFood.create(data);
};

const getProducedFoodsByObject = async (object_id, queryParams) => {
    const query = {
        object_id,
        ...buildDateFilter(queryParams, "date")
    };

    return await ProducedFood.find(query)
        .populate("recipe_id")
        .populate("ingredient_id")
        .sort({ date: -1 });
};

const updateProducedFood = async (id, updateData) => {
    const unsetFields = {};

    if (!updateData.ingredient_id) {
        delete updateData.ingredient_id;
        unsetFields.ingredient_id = "";
    }

    if (!updateData.recipe_id) {
        delete updateData.recipe_id;
        unsetFields.recipe_id = "";
    }

    const update = { $set: updateData };

    if (Object.keys(unsetFields).length > 0) {
        update.$unset = unsetFields;
    }

    const updated = await ProducedFood.findByIdAndUpdate(id, update, { new: true });
    if (!updated) throw new Error("Produced food record not found");
    return updated;
};

const deleteProducedFood = async (id) => {
    const deleted = await ProducedFood.findByIdAndDelete(id);
    if (!deleted) throw new Error("Produced food record not found");
    return true;
};

export default {
    createProducedFood,
    getProducedFoodsByObject,
    updateProducedFood,
    deleteProducedFood,
};