import { useState } from "react";
import api from "../../../services/api";

export default function EditFoodLogModal({
    log,
    foodGroups,
    suppliers,
    employees,
    onClose,
    onUpdated
}) {
    const [form, setForm] = useState({
        date: log.date.slice(0, 10),
        supplier_id: log.supplier_id,
        food_group_id: foodGroups.find(f => f.food_name === log.product_type)?._id || "",
        batch_number: log.batch_number,
        shelf_life: log.shelf_life.slice(0, 10),
        quantity: log.quantity,
        transport_type: log.transport_type || "",
        document: log.document || "",
        employee_id: log.employee_id
    });

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        await api.put(`/food-logs/edit/${log._id}`, {
            date: form.date,
            supplier_id: form.supplier_id,
            product_type: foodGroups.find(f => f._id === form.food_group_id)?.food_name,
            batch_number: form.batch_number,
            shelf_life: form.shelf_life,
            quantity: Number(form.quantity),
            transport_type: form.transport_type,
            document: form.document,
            employee_id: form.employee_id
        });

        onUpdated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">
                    Редактиране на запис
                </h2>

                <form
                    onSubmit={onSubmit}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <input type="date" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md" />

                    <select name="supplier_id" value={form.supplier_id} onChange={onChange} required className="border px-3 py-2 rounded-md">
                        <option value="">Доставчик</option>
                        {suppliers.map(s => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>

                    <select name="food_group_id" value={form.food_group_id} onChange={onChange} required className="border px-3 py-2 rounded-md">
                        <option value="">Вид храна</option>
                        {foodGroups.map(f => (
                            <option key={f._id} value={f._id}>{f.food_name}</option>
                        ))}
                    </select>

                    <input name="batch_number" value={form.batch_number} onChange={onChange} className="border px-3 py-2 rounded-md" required />
                    <input type="date" name="shelf_life" value={form.shelf_life} onChange={onChange} className="border px-3 py-2 rounded-md" required />
                    <input type="number" name="quantity" value={form.quantity} onChange={onChange} className="border px-3 py-2 rounded-md" required />

                    <input name="transport_type" value={form.transport_type} onChange={onChange} className="border px-3 py-2 rounded-md" />
                    <input name="document" value={form.document} onChange={onChange} className="border px-3 py-2 rounded-md" />

                    <select name="employee_id" value={form.employee_id} onChange={onChange} required className="border px-3 py-2 rounded-md md:col-span-2">
                        <option value="">Служител</option>
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    <div className="md:col-span-3 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="border px-4 py-2 rounded-md">
                            Отказ
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
