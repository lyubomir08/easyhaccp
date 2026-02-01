import { useState } from "react";
import api from "../../services/api";

export default function EditDisinfectantModal({ disinfectant, onClose, onUpdated }) {
    const [name, setName] = useState(disinfectant.name || "");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/disinfectants/edit/${disinfectant._id}`, {
                name: name.trim(),
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
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* modal */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    Редакция на дезинфектант
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Име на дезинфектант"
                        className="border px-3 py-2 rounded-md w-full"
                        required
                    />

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
