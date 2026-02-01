import { useState } from "react";
import api from "../../../services/api";

export default function FridgeTemperatureEditModal({
    log,
    fridges,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date ? log.date.slice(0, 16) : "",
        fridge_id: log.fridge_id?._id || "",
        measured_temp: log.measured_temp ?? "",
        corrective_action: log.corrective_action || "",
        employee_id: log.employee_id?._id || ""
    });

    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(`/fridge-logs/edit/${log._id}`, {
                ...form,
                measured_temp: Number(form.measured_temp)
            });

            onSaved();
            onClose();
        } catch (err) {
            console.error("EDIT ERROR:", err.response?.data);
            setError("Грешка при редакция");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">
                    Редакция на температура
                </h2>

                <form
                    onSubmit={onSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        type="datetime-local"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md"
                    />

                    <select
                        name="fridge_id"
                        value={form.fridge_id}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md"
                    >
                        {fridges.map(f => (
                            <option key={f._id} value={f._id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        step="0.1"
                        name="measured_temp"
                        value={form.measured_temp}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md"
                    />

                    <select
                        name="employee_id"
                        value={form.employee_id}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">—</option>
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="corrective_action"
                        value={form.corrective_action}
                        onChange={onChange}
                        placeholder="Мерки при отклонение"
                        className="border px-3 py-2 rounded-md md:col-span-2"
                    />

                    {error && (
                        <p className="md:col-span-2 text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="md:col-span-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
