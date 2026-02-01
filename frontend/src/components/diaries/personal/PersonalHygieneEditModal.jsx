import { useState } from "react";
import api from "../../../services/api";

export default function PersonalHygieneEditModal({
    log,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date ? log.date.slice(0, 16) : "",
        employee_id: log.employee_id?._id || "",
        health_status: log.health_status || "healthy",
        uniform_status: log.uniform_status || "clean"
    });

    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }));
    };

    /* ✅ EDIT – ПРАВИЛЕН ENDPOINT */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(
                `/personal-hygiene-logs/${log._id}`,
                {
                    date: form.date,
                    employee_id: form.employee_id,
                    health_status: form.health_status,
                    uniform_status: form.uniform_status
                }
            );

            await onSaved();
            onClose();
        } catch (err) {
            console.error("EDIT ERROR:", err.response?.data);
            setError(
                err.response?.data?.message ||
                "Грешка при редактиране"
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
                <h2 className="text-lg font-medium">
                    Редактиране на запис
                </h2>

                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        type="datetime-local"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <select
                        name="employee_id"
                        value={form.employee_id}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    >
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="health_status"
                        value={form.health_status}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    >
                        <option value="healthy">Здрав</option>
                        <option value="sick">Болен</option>
                    </select>

                    <select
                        name="uniform_status"
                        value={form.uniform_status}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    >
                        <option value="clean">Чисто</option>
                        <option value="dirty">Замърсено</option>
                    </select>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
