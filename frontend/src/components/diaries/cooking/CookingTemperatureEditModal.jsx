import { useState } from "react";
import api from "../../../services/api";

export default function CookingTemperatureEditModal({
    log,
    foodGroups,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        food_group_id: log.food_group_id?._id || "",
        measured_temp: log.measured_temp || "",
        shelf_life: log.shelf_life || "",
        employee_id: log.employee_id?._id || ""
    });

    const [error, setError] = useState("");

    const onChange = e =>
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onSubmit = async e => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                date: new Date(form.date).toISOString(),
                food_group_id: form.food_group_id,
                measured_temp: Number(form.measured_temp),
                shelf_life: form.shelf_life || undefined,
                employee_id: form.employee_id || undefined
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.put(`/cooking-temp/edit/${log._id}`, payload);
            await onSaved();
            onClose();
        } catch (err) {
            console.error(err.response?.data);
            setError("Грешка при актуализация");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                    Редакция на запис за температура при готвене
                </h2>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Дата и час <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium mb-1">
                            Храна/Продукт <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="food_group_id"
                            value={form.food_group_id}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        >
                            <option value="">-- Избери храна --</option>
                            {foodGroups.map(f => (
                                <option key={f._id} value={f._id}>
                                    {f.food_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Измерена температура (°C) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="measured_temp"
                            value={form.measured_temp}
                            onChange={onChange}
                            placeholder="Температура в °C"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Минимум: 75°C</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Срок на годност</label>
                        <input
                            type="text"
                            name="shelf_life"
                            value={form.shelf_life}
                            onChange={onChange}
                            placeholder="напр. 24 часа"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Служител</label>
                        <select
                            name="employee_id"
                            value={form.employee_id}
                            onChange={onChange}
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

                    {error && (
                        <p className="md:col-span-2 text-red-500 text-sm">{error}</p>
                    )}

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Отказ
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}