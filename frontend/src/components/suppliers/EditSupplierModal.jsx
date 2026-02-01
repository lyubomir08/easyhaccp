import { useState } from "react";
import api from "../../services/api";

export default function EditSupplierModal({ supplier, objectId, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: supplier.name || "",
        address: supplier.address || "",
        goods_type: supplier.goods_type || "",
        registration_number: supplier.registration_number || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(`/suppliers/edit/${supplier._id}`, {
                ...form,
                object_id: objectId, // 🔥 важно за бекенда
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
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    Редакция на доставчик
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        name="goods_type"
                        value={form.goods_type}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        name="registration_number"
                        value={form.registration_number}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

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
