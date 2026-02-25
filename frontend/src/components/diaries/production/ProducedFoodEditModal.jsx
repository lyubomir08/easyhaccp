import { useState } from "react";
import api from "../../../services/api";

export default function ProducedFoodEditModal({ log, recipes, onClose, onSaved }) {
    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        recipe_id: log.recipe_id?._id ? String(log.recipe_id._id) : "",
        portions: log.portions || "",
        product_batch_number: log.product_batch_number || "",
        product_shelf_life: log.product_shelf_life || ""
    });

    const [error, setError] = useState("");

    const onChange = e => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);

        if (recipe) {
            const now = new Date();
            const recipeNumber = recipe.recipe_number || (recipes.findIndex(r => r._id === id) + 1);
            const productBatchNumber = `Рецепта №${recipeNumber} - ${now.toLocaleDateString("bg-BG")}`;
            const shelfLife = recipe._group_shelf_life || "";

            setForm(s => ({
                ...s,
                recipe_id: id,
                product_batch_number: productBatchNumber,
                product_shelf_life: shelfLife
            }));
        } else {
            setForm(s => ({ ...s, recipe_id: "" }));
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                date: new Date(form.date).toISOString(),
                portions: form.portions ? Number(form.portions) : undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life || undefined,
                recipe_production_date: form.recipe_id ? new Date().toISOString() : undefined
            };

            if (form.recipe_id && form.recipe_id !== "undefined") {
                payload.recipe_id = form.recipe_id;
            }

            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.put(`/produced-foods/edit/${log._id}`, payload);
            await onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при актуализация");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Редакция на произведена храна</h2>

                <form onSubmit={onSubmit} className="space-y-4">
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Готов продукт - Рецепти</label>
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

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                            Отказ
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}