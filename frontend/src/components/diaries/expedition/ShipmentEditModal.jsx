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
        product_batch_number: log.produced_food_id?.product_batch_number || "",
        client_id: log.client_id?._id || "",
        document: log.document || "",
        employee_id: log.employee_id?._id || ""
    });

    const [error, setError] = useState("");

    const onChange = e =>
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    // Auto-fill при смяна на храна (wholesale)
    const onFoodLogChange = (e) => {
        const id = e.target.value;
        const foodLog = foodLogs.find(f => f._id === id);

        setForm(s => ({
            ...s,
            food_log_id: id,
            quantity: foodLog?.quantity || ""
        }));
    };

    // Auto-fill при смяна на готова храна (catering)
    const onProducedFoodChange = (e) => {
        const id = e.target.value;
        const produced = producedFoods.find(p => p._id === id);

        setForm(s => ({
            ...s,
            produced_food_id: id,
            quantity: produced?.portions || "",
            product_batch_number: produced?.product_batch_number || ""
        }));
    };

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

            if (shipmentType === "wholesale") {
                payload.food_log_id = form.food_log_id;
                payload.client_id = form.client_id || undefined;
            } else {
                payload.produced_food_id = form.produced_food_id;
            }

            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.put(`/shipments/edit/${log._id}`, payload);
            await onSaved();
            onClose();
        } catch (err) {
            console.error(err.response?.data);
            setError("Грешка при актуализация");
        }
    };

    // Selected produced food for details panel
    const selectedProducedFood = producedFoods.find(p => p._id === form.produced_food_id);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">
                    Редакция на експедиция
                </h2>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* TYPE BADGE */}
                    <div className="md:col-span-2">
                        <span className={`text-xs px-3 py-1 rounded ${
                            shipmentType === "wholesale"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                        }`}>
                            {shipmentType === "wholesale" ? "Търговия на едро" : "Кетъринг"}
                        </span>
                    </div>

                    {/* ДАТА */}
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
                                    onChange={onFoodLogChange}
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери храна --</option>
                                    {foodLogs.map(f => (
                                        <option key={f._id} value={f._id}>
                                            {f.product_type} | Партида: {f.batch_number} | Срок: {f.shelf_life}
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
                                onChange={onProducedFoodChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери храна --</option>
                                {producedFoods.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.recipe_id?.name || p.ingredient_id?.food_name || "Без име"}
                                        {p.product_batch_number ? ` | ${p.product_batch_number}` : ""}
                                        {` | ${new Date(p.date).toLocaleDateString("bg-BG")}`}
                                    </option>
                                ))}
                            </select>

                            {/* Детайли на избраната храна */}
                            {selectedProducedFood && (
                                <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3 text-sm space-y-1">
                                    {selectedProducedFood.product_batch_number && (
                                        <div>
                                            <span className="text-gray-500">Партида:</span>{" "}
                                            <span className="font-medium">{selectedProducedFood.product_batch_number}</span>
                                        </div>
                                    )}
                                    {selectedProducedFood.product_shelf_life && (
                                        <div>
                                            <span className="text-gray-500">Срок на годност:</span>{" "}
                                            <span className="font-medium">{selectedProducedFood.product_shelf_life}</span>
                                        </div>
                                    )}
                                    {selectedProducedFood.portions && (
                                        <div>
                                            <span className="text-gray-500">Брой порции:</span>{" "}
                                            <span className="font-medium">{selectedProducedFood.portions}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* КОЛИЧЕСТВО */}
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

                    {/* ПАРТИДЕН НОМЕР - само за кетъринг, автоматично */}
                    {shipmentType === "catering" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Партиден номер</label>
                            <input
                                disabled
                                value={form.product_batch_number}
                                placeholder="Автоматично при избор на храна"
                                className="border px-3 py-2 rounded-md w-full bg-slate-100 text-slate-700"
                            />
                            {form.product_batch_number && (
                                <p className="text-xs text-blue-600 mt-1">✓ Автоматично от дневник 3.3.7</p>
                            )}
                        </div>
                    )}

                    {/* ДОКУМЕНТ */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Документ</label>
                        <input
                            name="document"
                            value={form.document}
                            onChange={onChange}
                            placeholder="Документ"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    {/* СЛУЖИТЕЛ */}
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