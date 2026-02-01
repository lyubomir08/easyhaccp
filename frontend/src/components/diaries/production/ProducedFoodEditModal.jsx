import { useState } from "react";
import api from "../../../services/api";

export default function ProducedFoodEditModal({
    log,
    recipes,
    ingredients,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        recipe_id: log.recipe_id?._id || "",
        portions: log.portions || "",
        ingredient_id: log.ingredient_id?._id || "",
        ingredient_quantity: log.ingredient_quantity || "",
        ingredient_batch_number: log.ingredient_batch_number || "",
        ingredient_shelf_life: log.ingredient_shelf_life
            ? log.ingredient_shelf_life.slice(0, 16)
            : "",
        product_batch_number: log.product_batch_number || "",
        product_shelf_life: log.product_shelf_life
            ? log.product_shelf_life.slice(0, 16)
            : ""
    });

    const [error, setError] = useState("");

    const onChange = e =>
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));

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
                ingredient_shelf_life: form.ingredient_shelf_life
                    ? new Date(form.ingredient_shelf_life).toISOString()
                    : undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life
                    ? new Date(form.product_shelf_life).toISOString()
                    : undefined
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.put(`/produced-foods/edit/${log._id}`, payload);

            await onSaved();
            onClose();
        } catch (err) {
            console.error(err.response?.data);
            setError("Грешка при актуализация");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                    Редакция на произведена храна
                </h2>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
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
                        <label className="block text-sm font-medium mb-1">Рецепта</label>
                        <select
                            name="recipe_id"
                            value={form.recipe_id}
                            onChange={onChange}
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
                        <label className="block text-sm font-medium mb-1">Суровина</label>
                        <select
                            name="ingredient_id"
                            value={form.ingredient_id}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                        >
                            <option value="">-- Избери суровина --</option>
                            {ingredients.map(i => (
                                <option key={i._id} value={i._id}>{i.food_name}</option>
                            ))}
                        </select>
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium mb-1">Партида суровина</label>
                        <input
                            name="ingredient_batch_number"
                            value={form.ingredient_batch_number}
                            onChange={onChange}
                            placeholder="Партида суровина"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Срок на годност (суровина)</label>
                        <input
                            type="datetime-local"
                            name="ingredient_shelf_life"
                            value={form.ingredient_shelf_life}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Партида продукт</label>
                        <input
                            name="product_batch_number"
                            value={form.product_batch_number}
                            onChange={onChange}
                            placeholder="Партида продукт"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Срок на годност (продукт)</label>
                        <input
                            type="datetime-local"
                            name="product_shelf_life"
                            value={form.product_shelf_life}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    {error && (
                        <p className="md:col-span-2 text-red-500 text-sm">{error}</p>
                    )}

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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