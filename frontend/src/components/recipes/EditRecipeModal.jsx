import { useState } from "react";
import api from "../../services/api";

export default function EditRecipeModal({
    recipe,
    foodGroups,
    needsQuantity,
    onClose,
    onUpdated,
}) {
    const emptyItem = {
        food_group_id: recipe.food_group_id,
        product: "",
        quantity: "",
    };

    const [form, setForm] = useState({
        name: recipe.name,
        items: recipe.ingredients.map(i => ({
            food_group_id: recipe.food_group_id,
            product: i.ingredient,
            quantity: i.quantity || "",
        })),
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
                quantity: i.quantity ? Number(i.quantity) : undefined,
            })),
        };

        await api.put(`/recipes/edit/${recipe._id}`, payload);
        onUpdated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl space-y-4">
                <h2 className="text-lg font-medium">Редактиране на рецепта</h2>

                <input
                    value={form.name}
                    onChange={(e) =>
                        setForm(s => ({ ...s, name: e.target.value }))
                    }
                    className="border px-3 py-2 rounded-md w-full"
                    placeholder="Име на рецепта"
                />

                {form.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                        <select
                            value={item.food_group_id}
                            onChange={(e) =>
                                onChangeItem(idx, "food_group_id", e.target.value)
                            }
                            className="border px-3 py-2 rounded-md flex-1"
                        >
                            {foodGroups.map(f => (
                                <option key={f._id} value={f._id}>
                                    {f.food_name}
                                </option>
                            ))}
                        </select>

                        <input
                            value={item.product}
                            onChange={(e) =>
                                onChangeItem(idx, "product", e.target.value)
                            }
                            className="border px-3 py-2 rounded-md flex-1"
                            placeholder="Продукт"
                        />

                        {needsQuantity && (
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    onChangeItem(idx, "quantity", e.target.value)
                                }
                                className="border px-3 py-2 rounded-md w-28"
                                placeholder="Кол-во"
                            />
                        )}

                        <button
                            onClick={() => removeItem(idx)}
                            className="text-red-600 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <div className="flex justify-between pt-4 border-t">
                    <button
                        onClick={addItem}
                        className="text-blue-600 text-sm"
                    >
                        + Добави продукт
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="border px-4 py-2 rounded-md"
                        >
                            Отказ
                        </button>
                        <button
                            onClick={onSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md"
                        >
                            Запази
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
