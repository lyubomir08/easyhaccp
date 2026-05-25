import { useState } from "react";
import api from "../../services/api";

export default function EditRecipeModal({
    recipe,
    foodGroups,
    onClose,
    onUpdated,
}) {
    const emptyItem = {
        food_group_id: recipe.food_group_id,
        product: "",
        quantity: "",
        unit: "гр",
    };

    const [form, setForm] = useState({
        name: recipe.name,
        items: recipe.ingredients.map(i => {
            const grams = i.quantity || "";
            const useKg = grams && grams >= 1000 && grams % 1 === 0;
            return {
                food_group_id: recipe.food_group_id,
                product: i.ingredient,
                quantity: useKg ? grams / 1000 : grams,
                unit: useKg ? "кг" : "гр",
            };
        }),
    });

    const addItem = () => {
        setForm(s => ({
            ...s,
            items: [...s.items, { ...emptyItem }],
        }));
    };

    const removeItem = (index) => {
        setForm(s => ({
            ...s,
            items: s.items.filter((_, i) => i !== index),
        }));
    };

    const onChangeItem = (index, field, value) => {
        const items = [...form.items];
        items[index][field] = value;
        setForm(s => ({ ...s, items }));
    };

    const onSave = async () => {
        const payload = {
            name: form.name,
            ingredients: form.items.map(i => ({
                ingredient: i.product,
                quantity: i.quantity
                    ? (i.unit === "кг" ? Number(i.quantity) * 1000 : Number(i.quantity))
                    : undefined,
            })),
        };

        await api.put(`/recipes/edit/${recipe._id}`, payload);
        onUpdated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4">
                <h2 className="text-lg font-medium">Редактиране на рецепта</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Име на рецепта</label>
                    <input
                        value={form.name}
                        onChange={(e) =>
                            setForm(s => ({ ...s, name: e.target.value }))
                        }
                        className="border px-3 py-2 rounded-md w-full"
                        placeholder="Име на рецепта"
                        required
                    />
                </div>

                <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Съставки</label>
                    {form.items.map((item, idx) => (
                        <div key={idx} className="mb-3 space-y-2">
                            {/* Food group select - full width */}
                            <select
                                value={item.food_group_id}
                                onChange={(e) => onChangeItem(idx, "food_group_id", e.target.value)}
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                {foodGroups.map(f => (
                                    <option key={f._id} value={f._id}>{f.food_name}</option>
                                ))}
                            </select>
                            {/* Product - full width */}
                            <input
                                value={item.product}
                                onChange={(e) => onChangeItem(idx, "product", e.target.value)}
                                className="border px-3 py-2 rounded-md w-full"
                                placeholder="Продукт"
                                required
                            />
                            {/* Quantity + unit toggle + remove button in a row */}
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={item.quantity}
                                    onChange={(e) => onChangeItem(idx, "quantity", e.target.value)}
                                    className={`border px-3 py-2 rounded-md flex-1 min-w-0 ${!item.quantity ? "border-orange-400 bg-orange-50" : ""}`}
                                    placeholder="Количество *"
                                    required
                                />
                                <div className="flex border rounded-md overflow-hidden shrink-0">
                                    {["кг", "гр"].map(u => (
                                        <button
                                            key={u}
                                            type="button"
                                            onClick={() => onChangeItem(idx, "unit", u)}
                                            className={`px-3 py-2 text-sm font-medium transition ${item.unit === u ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            {u}
                                        </button>
                                    ))}
                                </div>
                                {form.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="text-red-600 text-lg hover:text-red-800 shrink-0 px-1"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between pt-4 border-t">
                    <button
                        type="button"
                        onClick={addItem}
                        className="text-blue-600 text-sm hover:text-blue-800"
                    >
                        + Добави продукт
                    </button>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded-md hover:bg-gray-50"
                        >
                            Отказ
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Запази
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
