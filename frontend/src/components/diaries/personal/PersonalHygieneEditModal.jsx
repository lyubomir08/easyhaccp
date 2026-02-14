import { useState } from "react";
import api from "../../../services/api";

export default function PersonalHygieneEditModal({
    log,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date ? new Date(log.date).toISOString().slice(0, 16) : "",
        employee_id: log.employee_id?._id || "",
        health_status: log.health_status || "healthy",
        uniform_status: log.uniform_status || "clean"
    });

    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(`/personal-hygiene/edit/${log._id}`, {
                date: new Date(form.date).toISOString(),
                employee_id: form.employee_id,
                health_status: form.health_status,
                uniform_status: form.uniform_status
            });

            await onSaved();
            onClose();
        } catch (err) {
            console.error("EDIT ERROR:", err.response?.data);
            setError(err.response?.data?.message || "Грешка при редактиране");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">
                    Редактиране на запис
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Дата и час</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={form.date}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Служител</label>
                        <select
                            name="employee_id"
                            value={form.employee_id}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        >
                            <option value="">-- Избери служител --</option>
                            {employees.map(e => (
                                <option key={e._id} value={e._id}>
                                    {e.first_name} {e.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Здравен статус</label>
                        <select
                            name="health_status"
                            value={form.health_status}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        >
                            <option value="healthy">Здрав</option>
                            <option value="sick">Болен</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Работно облекло</label>
                        <select
                            name="uniform_status"
                            value={form.uniform_status}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        >
                            <option value="clean">Чисто</option>
                            <option value="dirty">Замърсено</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}