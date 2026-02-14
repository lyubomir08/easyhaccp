import { useState } from "react";
import api from "../../../services/api";

export default function ProducedFoodEditModal({
    log,
    recipes,
    foodLogs,
    onClose,
    onSaved
}) {
    // Find the matching food log for the ingredient if it exists
    const matchingFoodLog = log.ingredient_id 
        ? foodLogs.find(f => {
            const fgId = f.food_group_id?._id || f.food_group_id;
            return String(fgId) === String(log.ingredient_id._id || log.ingredient_id);
        })
        : null;

    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        recipe_id: log.recipe_id?._id || "",
        portions: log.portions || "",
        ingredient_id: log.ingredient_id?._id || "",
        ingredient_quantity: log.ingredient_quantity || "",
        ingredient_batch_number: log.ingredient_batch_number || "",
        ingredient_shelf_life: log.ingredient_shelf_life || "",
        product_batch_number: log.product_batch_number || "",
        product_shelf_life: log.product_shelf_life || ""
    });

    const [selectedFoodLogId, setSelectedFoodLogId] = useState(matchingFoodLog?._id || "");
    const [error, setError] = useState("");

    const onChange = e =>
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    /* AUTO-FILL при промяна на рецепта */
    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);

        if (recipe) {
            const now = new Date();
            const recipeNumber = recipe.recipe_number || (recipes.findIndex(r => r._id === id) + 1);
            const productBatchNumber = `Рецепта №${recipeNumber} - ${now.toLocaleDateString("bg-BG")}`;

            setForm(s => ({
                ...s,
                recipe_id: id,
                product_batch_number: productBatchNumber,
                product_shelf_life: recipe.shelf_life || "3 часа"
            }));
        } else {
            setForm(s => ({ ...s, recipe_id: id }));
        }
    };

    /* AUTO-FILL при промяна на суровина */
    const onFoodLogChange = (e) => {
        const foodLogId = e.target.value;
        setSelectedFoodLogId(foodLogId);
        
        if (!foodLogId) {
            setForm(s => ({
                ...s,
                ingredient_id: "",
                ingredient_batch_number: "",
                ingredient_shelf_life: ""
            }));
            return;
        }

        const foodLog = foodLogs.find(f => f._id === foodLogId);

        if (foodLog) {
            const ingredientId = foodLog.food_group_id?._id || foodLog.food_group_id;
            
            let shelfLife = "";
            if (foodLog.shelf_life) {
                const dateValue = new Date(foodLog.shelf_life);
                if (!isNaN(dateValue.getTime())) {
                    shelfLife = dateValue.toLocaleString("bg-BG", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                    });
                } else {
                    shelfLife = foodLog.shelf_life;
                }
            }

            setForm(s => ({
                ...s,
                ingredient_id: String(ingredientId),
                ingredient_batch_number: foodLog.batch_number || "",
                ingredient_shelf_life: shelfLife
            }));
        } else {
            setForm(s => ({ ...s, ingredient_id: "" }));
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                date: new Date(form.date).toISOString(),
                recipe_id: form.recipe_id || undefined,
                portions: form.portions ? Number(form.portions) : undefined,
                ingredient_id: form.ingredient_id || undefined,
                ingredient_quantity: form.ingredient_quantity ? Number(form.ingredient_quantity) : undefined,
                ingredient_batch_number: form.ingredient_batch_number || undefined,
                ingredient_shelf_life: form.ingredient_shelf_life || undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life || undefined,
                recipe_production_date: form.recipe_id ? new Date().toISOString() : undefined
            };

            // Convert empty strings to undefined for ObjectId fields
            if (payload.recipe_id === "") delete payload.recipe_id;
            if (payload.ingredient_id === "") delete payload.ingredient_id;
            
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            console.log("Edit payload:", payload);
            await api.put(`/produced-foods/edit/${log._id}`, payload);
            await onSaved();
            onClose();
        } catch (err) {
            console.error("Edit error:", err);
            console.error("Error response:", err.response?.data);
            setError(err.response?.data?.message || "Грешка при актуализация");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                    Редакция на произведена храна
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    
                    {/* ДАТА */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Дата и час</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={form.date}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* СУРОВИНА */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Суровина (от дневник 3.3.1)</label>
                            <select
                                value={selectedFoodLogId}
                                onChange={onFoodLogChange}
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери суровина --</option>
                                {foodLogs.map(f => (
                                    <option key={f._id} value={f._id}>
                                        {f.food_group_id?.food_name || f.product_type} — Партида: {f.batch_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* КОЛИЧЕСТВО СУРОВИНА */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Количество суровина</label>
                            <input
                                type="number"
                                step="0.01"
                                name="ingredient_quantity"
                                value={form.ingredient_quantity}
                                onChange={onChange}
                                placeholder="Количество"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        {/* ПАРТИДА СУРОВИНА */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Партиден номер (суровина)</label>
                            <input
                                type="text"
                                name="ingredient_batch_number"
                                value={form.ingredient_batch_number}
                                onChange={onChange}
                                placeholder="Партида суровина"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        {/* СРОК СУРОВИНА - STRING */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Срок на годност (суровина)</label>
                            <input
                                type="text"
                                name="ingredient_shelf_life"
                                value={form.ingredient_shelf_life}
                                onChange={onChange}
                                placeholder="напр. 3 часа или 14.02.2026, 12:09"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        {/* РЕЦЕПТА */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Количество ГОТОВ ПРОДУКТ - РЕЦЕПТИ</label>
                            <select
                                name="recipe_id"
                                value={form.recipe_id}
                                onChange={onRecipeChange}
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери рецепта --</option>
                                {recipes.map(r => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* БРОЙ ПОРЦИИ */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Брой порции</label>
                            <input
                                type="number"
                                name="portions"
                                value={form.portions}
                                onChange={onChange}
                                placeholder="Брой порции"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        {/* ПАРТИДА ПРОДУКТ */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Партиден номер на готовия продукт</label>
                            <input
                                type="text"
                                name="product_batch_number"
                                value={form.product_batch_number}
                                onChange={onChange}
                                placeholder="Партида продукт"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        {/* СРОК ПРОДУКТ - STRING */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Срок на годност на готовия продукт</label>
                            <input
                                type="text"
                                name="product_shelf_life"
                                value={form.product_shelf_life}
                                onChange={onChange}
                                placeholder="напр. 3 часа"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}