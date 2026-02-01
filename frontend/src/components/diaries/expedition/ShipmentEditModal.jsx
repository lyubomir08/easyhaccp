import { useState } from "react";
import api from "../../../services/api";

export default function ShipmentEditModal({
    log,
    foodLogs,
    producedFoods,
    clients,
    employees,
    onClose,
    onSaved
}) {
    const shipmentType = log.food_log_id ? "wholesale" : "catering";

    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        food_log_id: log.food_log_id?._id || "",
        produced_food_id: log.produced_food_id?._id || "",
        quantity: log.quantity || "",
        client_id: log.client_id?._id || "",
        document: log.document || "",
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
                quantity: Number(form.quantity),
                document: form.document || undefined,
                employee_id: form.employee_id || undefined
            };

            // Add type-specific fields
            if (shipmentType === "wholesale") {
                payload.food_log_id = form.food_log_id;
                payload.client_id = form.client_id || undefined;
            } else {
                payload.produced_food_id = form.produced_food_id;
            }

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.put(`/shipments/edit/${log._id}`, payload);

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
                    Редакция на експедиция
                </h2>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipment Type Badge */}
                    <div className="md:col-span-2">
                        <span className={`text-xs px-3 py-1 rounded ${
                            shipmentType === "wholesale" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-green-100 text-green-700"
                        }`}>
                            {shipmentType === "wholesale" ? "Търговия на едро" : "Кетъринг"}
                        </span>
                    </div>

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

                    {/* WHOLESALE FIELDS */}
                    {shipmentType === "wholesale" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Храна <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="food_log_id"
                                    value={form.food_log_id}
                                    onChange={onChange}
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери храна --</option>
                                    {foodLogs.map(f => (
                                        <option key={f._id} value={f._id}>
                                            {f.food_group_id?.food_name} - Партида: {f.batch_number}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Фирма получател <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="client_id"
                                    value={form.client_id}
                                    onChange={onChange}
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери получател --</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* CATERING FIELDS */}
                    {shipmentType === "catering" && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Готова храна <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="produced_food_id"
                                value={form.produced_food_id}
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери храна --</option>
                                {producedFoods.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.recipe_id?.name || p.ingredient_id?.food_name} - Партида: {p.product_batch_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Количество <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="quantity"
                            value={form.quantity}
                            onChange={onChange}
                            placeholder="Количество"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Документ</label>
                        <input
                            name="document"
                            value={form.document}
                            onChange={onChange}
                            placeholder="Номер на документ"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div className="md:col-span-2">
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