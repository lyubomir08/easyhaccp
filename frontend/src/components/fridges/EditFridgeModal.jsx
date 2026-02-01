import { useState } from "react";
import api from "../../services/api";

export default function EditFridgeModal({ fridge, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: fridge.name || "",
        norm_min: fridge.norm_min,
        norm_max: fridge.norm_max,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(`/fridges/edit/${fridge._id}`, {
                name: form.name.trim() || undefined,
                norm_min: Number(form.norm_min),
                norm_max: Number(form.norm_max),
            });

            onUpdated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при редакция");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-medium mb-4">
                    Редактиране на хладилник
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="№ / Име"
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        type="number"
                        name="norm_min"
                        value={form.norm_min}
                        onChange={onChange}
                        placeholder="Норма от (°C)"
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        type="number"
                        name="norm_max"
                        value={form.norm_max}
                        onChange={onChange}
                        placeholder="Норма до (°C)"
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded-md"
                        >
                            Отказ
                        </button>
                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            {loading ? "Запис..." : "Запази"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
