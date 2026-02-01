import { useEffect, useState } from "react";
import api from "../../../services/api";
import EditFoodLogModal from "./EditFoodLogModal";

export default function FoodsDiary() {
    const [objects, setObjects] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [allLogs, setAllLogs] = useState([]);

    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        supplier_id: "",
        food_group_id: "",
        batch_number: "",
        shelf_life: "",
        quantity: "",
        transport_type: "",
        document: "",
        employee_id: ""
    });

    useEffect(() => {
        api.get("/objects").then(res => setObjects(res.data));
    }, []);

    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/food-groups/${form.object_id}`).then(r => setFoodGroups(r.data));
        api.get(`/suppliers/object/${form.object_id}`).then(r => setSuppliers(r.data));
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data));
        loadLogs();
    }, [form.object_id]);

    const loadLogs = async () => {
        const res = await api.get(`/food-logs/${form.object_id}`);
        setAllLogs(res.data);
    };

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/food-logs", {
                object_id: form.object_id,
                date: form.date,
                supplier_id: form.supplier_id,
                product_type:
                    foodGroups.find(f => f._id === form.food_group_id)?.food_name,
                batch_number: form.batch_number,
                shelf_life: form.shelf_life,
                quantity: Number(form.quantity),
                transport_type: form.transport_type,
                document: form.document,
                employee_id: form.employee_id
            });

            loadLogs();
        } catch {
            setError("Грешка при запазване");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        await api.delete(`/food-logs/delete/${id}`);
        loadLogs();
    };

    const filteredLogs = allLogs.filter(l => {
        const t = search.toLowerCase();
        return (
            l.product_type.toLowerCase().includes(t) ||
            l.batch_number.toLowerCase().includes(t)
        );
    });

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Дневник за храни и опаковки
            </h1>

            {/* OBJECT */}
            <section className="bg-white border rounded-xl p-4">
                <select
                    name="object_id"
                    value={form.object_id}
                    onChange={onChange}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </section>

            {/* FORM */}
            {form.object_id && (
                <section className="bg-white border rounded-xl p-6">
                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input type="date" name="date" onChange={onChange} required className="border px-3 py-2 rounded-md" />

                        <select name="supplier_id" onChange={onChange} required className="border px-3 py-2 rounded-md">
                            <option value="">Доставчик</option>
                            {suppliers.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>

                        <select name="food_group_id" onChange={onChange} required className="border px-3 py-2 rounded-md">
                            <option value="">Вид храна</option>
                            {foodGroups.map(f => (
                                <option key={f._id} value={f._id}>{f.food_name}</option>
                            ))}
                        </select>

                        <input name="batch_number" placeholder="Партида" onChange={onChange} className="border px-3 py-2 rounded-md" />
                        <input type="date" name="shelf_life" onChange={onChange} className="border px-3 py-2 rounded-md" />
                        <input type="number" name="quantity" placeholder="Количество" onChange={onChange} className="border px-3 py-2 rounded-md" />

                        <select name="employee_id" onChange={onChange} required className="border px-3 py-2 rounded-md md:col-span-2">
                            <option value="">Служител</option>
                            {employees.map(e => (
                                <option key={e._id} value={e._id}>
                                    {e.first_name} {e.last_name}
                                </option>
                            ))}
                        </select>

                        <div className="md:col-span-3 flex justify-end">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                                Запази
                            </button>
                        </div>

                        {error && (
                            <p className="md:col-span-3 text-red-500 text-sm">{error}</p>
                        )}
                    </form>
                </section>
            )}

            {/* SEARCH */}
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Търси по вид храна или партида..."
                className="border px-3 py-2 rounded-md w-full"
            />

            {/* LIST */}
            <div className="space-y-3">
                {visibleLogs.map(l => (
                    <div
                        key={l._id}
                        className="bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                       <div>
    <strong>{l.product_type}</strong>

    <div className="text-sm text-slate-600">
        Партида: {l.batch_number} • Количество: {l.quantity}
    </div>

    {l.created_at && (
        <div className="text-xs text-slate-400 mt-1">
            Създаден:{" "}
            {new Date(l.created_at).toLocaleString("bg-BG")}
        </div>
    )}
</div>


                        <div className="flex gap-3 text-sm">
                            <button
                                onClick={() => setEditingLog(l)}
                                className="text-blue-600"
                            >
                                Редактирай
                            </button>
                            <button
                                onClick={() => onDelete(l._id)}
                                className="text-red-600"
                            >
                                Изтрий
                            </button>
                        </div>
                    </div>
                ))}

                {visibleLogs.length === 0 && (
                    <p className="text-slate-500 text-sm">Няма резултати</p>
                )}
            </div>

            {editingLog && (
                <EditFoodLogModal
                    log={editingLog}
                    foodGroups={foodGroups}
                    suppliers={suppliers}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onUpdated={loadLogs}
                />
            )}
        </div>
    );
}
