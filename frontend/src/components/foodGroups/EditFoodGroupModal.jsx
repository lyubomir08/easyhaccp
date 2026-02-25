import { useState } from "react";
import api from "../../services/api";

export default function EditFoodGroupModal({ group, onClose, onUpdated }) {
    const [form, setForm] = useState({
        food_name: group.food_name || "",
        cooking_temp: group.cooking_temp ?? "",
        shelf_life: group.shelf_life || "",
    });

    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]: name === "cooking_temp" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/food-groups/edit/${group._id}`, {
                food_name: form.food_name.trim(),
                cooking_temp: form.cooking_temp === "" ? undefined : form.cooking_temp,
                shelf_life: form.shelf_life.trim(),
            });
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при редакция");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Редакция на група</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Вид храна</label>
                        <input
                            name="food_name"
                            value={form.food_name}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Температура °C</label>
                        <input
                            type="number"
                            name="cooking_temp"
                            value={form.cooking_temp}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Срок на годност</label>
                        <input
                            name="shelf_life"
                            value={form.shelf_life}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md w-full"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="border px-4 py-2 rounded-md">
                            Отказ
                        </button>
                        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                            {loading ? "Запис..." : "Запази"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}