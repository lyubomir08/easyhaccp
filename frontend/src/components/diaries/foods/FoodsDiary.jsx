import { useEffect, useState } from "react";
import api from "../../../services/api";
import EditFoodLogModal from "./EditFoodLogModal";

export default function FoodsDiary() {
    const [objects, setObjects] = useState([]);
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
        product_type: "",
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
                product_type: form.product_type,
                batch_number: form.batch_number,
                shelf_life: form.shelf_life,
                quantity: Number(form.quantity),
                transport_type: form.transport_type,
                document: form.document,
                employee_id: form.employee_id
            });
            loadLogs();
            setForm(s => ({
                ...s,
                date: "",
                supplier_id: "",
                product_type: "",
                batch_number: "",
                shelf_life: "",
                quantity: "",
                transport_type: "",
                document: "",
                employee_id: ""
            }));
        } catch (err) {
            console.error("Error details:", err.response?.data);
            setError(err.response?.data?.message || "Грешка при запазване");
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
        <div className="max-w-5xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">
                Дневник за храни и опаковки
            </h1>

            {/* OBJECT */}
            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
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
                    <h2 className="text-lg font-semibold mb-4">Добави нов запис</h2>
                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Дата</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Доставчик</label>
                            <select
                                name="supplier_id"
                                value={form.supplier_id}
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери доставчик --</option>
                                {suppliers.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Вид храна</label>
                            <input
                                type="text"
                                name="product_type"
                                value={form.product_type}
                                onChange={onChange}
                                placeholder="напр. Пиле, Свинско, Домати"
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Партиден номер</label>
                            <input
                                type="text"
                                name="batch_number"
                                value={form.batch_number}
                                placeholder="Партиден номер"
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Срок на годност</label>
                            <input
                                type="date"
                                name="shelf_life"
                                value={form.shelf_life}
                                onChange={onChange}
                                required
                                title="Срок на годност"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Количество</label>
                            <input
                                type="number"
                                step="0.01"
                                name="quantity"
                                value={form.quantity}
                                placeholder="Количество"
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Вид на използвания транспорт</label>
                            <input
                                type="text"
                                name="transport_type"
                                value={form.transport_type}
                                onChange={onChange}
                                placeholder="напр. хладилен камион"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Придружителен документ/сертификат</label>
                            <input
                                type="text"
                                name="document"
                                value={form.document}
                                onChange={onChange}
                                placeholder="Документ"
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

                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
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
            {form.object_id && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Търси по вид храна или партиден номер..."
                        className="border px-3 py-2 rounded-md w-full"
                    />
                </div>
            )}

            {/* LIST */}
            {form.object_id && (
                <div className="space-y-3">
                    {visibleLogs.map(l => (
                        <div
                            key={l._id}
                            className="bg-white border rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <strong>{l.product_type}</strong>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <div>
                                       Партиден номер: {l.batch_number} • Количество: {l.quantity} • Срок на годност: {new Date(l.shelf_life).toLocaleDateString("bg-BG")}
                                    </div>
                                    {l.transport_type && (
                                        <div>
                                            Транспорт: {l.transport_type}
                                        </div>
                                    )}
                                    {l.document && (
                                        <div>
                                            Документ: {l.document}
                                        </div>
                                    )}
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
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Редактирай
                                </button>
                                <button
                                    onClick={() => onDelete(l._id)}
                                    className="text-red-600 hover:text-blue-800"
                                >
                                    Изтрий
                                </button>
                            </div>
                        </div>
                    ))}

                    {visibleLogs.length === 0 && (
                        <p className="text-slate-500 text-sm">Няма резултати</p>
                    )}

                    {!search && allLogs.length > 10 && (
                        <p className="text-slate-500 text-sm text-center">
                            Показани са последните 10 записа. Използвайте търсенето за повече резултати.
                        </p>
                    )}
                </div>
            )}

            {editingLog && (
                <EditFoodLogModal
                    log={editingLog}
                    suppliers={suppliers}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onUpdated={loadLogs}
                />
            )}
        </div>
    );
}