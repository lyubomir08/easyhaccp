import { useState } from "react";
import api from "../../services/api";

export default function EditEmployeeModal({ employee, onClose, onUpdated }) {
    const [firstName, setFirstName] = useState(employee.first_name);
    const [lastName, setLastName] = useState(employee.last_name);
    const [position, setPosition] = useState(employee.position || "");
    const [healthExpiry, setHealthExpiry] = useState(
        employee.health_card_expiry
            ? employee.health_card_expiry.slice(0, 10)
            : ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.put(`/employees/edit/${employee._id}`, {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                position: position.trim(),
                health_card_expiry: healthExpiry
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
                    Редакция на служител
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Име"
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Фамилия"
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Длъжност"
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <input
                        type="date"
                        value={healthExpiry}
                        onChange={(e) => setHealthExpiry(e.target.value)}
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
