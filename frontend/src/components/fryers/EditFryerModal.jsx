import { useState } from "react";
import api from "../../services/api";

export default function EditFryerModal({ fryer, onClose, onUpdated }) {
    const [name, setName] = useState(fryer.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(`/fryers/edit/${fryer._id}`, {
                name: name.trim(),
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
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    Редакция на фритюрник
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="№ / Име"
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
