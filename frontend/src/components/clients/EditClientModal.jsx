import { useState } from "react";
import api from "../../services/api";

export default function EditClientModal({ client, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: client.name || "",
        address: client.address || "",
        registration_number: client.registration_number || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            await api.put(`/clients/edit/${client._id}`, {
                name: form.name.trim(),
                address: form.address.trim(),
                registration_number: form.registration_number.trim(),
            });

            onUpdated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при редактиране");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-lg font-medium mb-4">
                    Редактиране на клиент
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Име"
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        placeholder="Адрес"
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        name="registration_number"
                        value={form.registration_number}
                        onChange={onChange}
                        placeholder="Регистрационен №"
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
                            className="bg-blue-600 text-white px-6 py-2 rounded-md"
                        >
                            {loading ? "Запис..." : "Запази"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
