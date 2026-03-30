import { useEffect, useState } from "react";
import api from "../../../services/api";
import ShipmentEditModal from "./ShipmentEditModal";

const OBJECT_TYPE_LABELS = {
    wholesale: "Търговия на едро",
    catering: "Кетъринг",
};

export default function ShipmentDiary() {
    const [objects, setObjects] = useState([]);
    const [foodLogs, setFoodLogs] = useState([]);
    const [producedFoods, setProducedFoods] = useState([]);
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [shipmentType, setShipmentType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [form, setForm] = useState({
        object_id: "", date: "", food_log_id: "", produced_food_id: "",
        quantity: "", product_batch_number: "", client_id: "", document: "", employee_id: ""
    });

    const fmtDate = (v) => (v ? String(v).split("T")[0] : "");

    useEffect(() => {
        api.get("/objects").then(res => {
            setObjects(res.data.filter(o => o.object_type === "wholesale" || o.object_type === "catering"));
        });
    }, []);

    useEffect(() => {
        if (!form.object_id) return;

        const obj = objects.find(o => o._id === form.object_id);
        if (obj) setShipmentType(obj.object_type === "catering" ? "catering" : "wholesale");

        api.get(`/food-logs/${form.object_id}?page=1&limit=1000`)
            .then(r => setFoodLogs(r.data.logs || []))
            .catch(() => setFoodLogs([]));

        api.get(`/produced-foods/${form.object_id}?page=1&limit=1000`)
            .then(r => setProducedFoods(r.data.logs || []))
            .catch(() => setProducedFoods([]));

        api.get(`/clients/${form.object_id}`)
            .then(r => setClients(r.data))
            .catch(() => setClients([]));

        api.get(`/employees/${form.object_id}`)
            .then(r => setEmployees(r.data))
            .catch(() => setEmployees([]));

        loadLogs(1);
    }, [form.object_id, objects]);

    const loadLogs = async (page = 1) => {
        if (!form.object_id) return;

        try {
            const res = await api.get(`/shipments/${form.object_id}?page=${page}&limit=10`);
            setLogs(res.data.logs || []);
            setCurrentPage(res.data.page || 1);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Load logs error:", err.response?.data);
            setLogs([]);
            setCurrentPage(1);
            setTotalPages(1);
        }
    };

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onFoodLogChange = (e) => {
        const id = e.target.value;
        const fl = foodLogs.find(f => f._id === id);
        setForm(s => ({ ...s, food_log_id: id, quantity: fl?.quantity || "" }));
    };

    const onProducedFoodChange = (e) => {
        const id = e.target.value;
        const p = producedFoods.find(p => p._id === id);
        setForm(s => ({ ...s, produced_food_id: id, quantity: p?.portions || "", product_batch_number: p?.product_batch_number || "" }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                object_id: form.object_id,
                date: new Date(form.date).toISOString(),
                quantity: Number(form.quantity),
                client_id: form.client_id || undefined,
                document: form.document || undefined,
                employee_id: form.employee_id || undefined
            };
            if (shipmentType === "wholesale") payload.food_log_id = form.food_log_id;
            else payload.produced_food_id = form.produced_food_id;
            Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
            await api.post("/shipments", payload);
            await loadLogs(1);
            setForm(s => ({ ...s, date: "", food_log_id: "", produced_food_id: "", quantity: "", product_batch_number: "", client_id: "", document: "", employee_id: "" }));
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте?")) return;
        try { await api.delete(`/shipments/delete/${id}`); await loadLogs(currentPage); }
        catch { alert("Грешка при изтриване"); }
    };

    const filteredLogs = (logs || []).filter(l => {
        const s = search.toLowerCase();
        return (
            (l.food_log_id?.product_type || "").toLowerCase().includes(s) ||
            (l.produced_food_id?.recipe_id?.name || "").toLowerCase().includes(s) ||
            (l.client_id?.name || "").toLowerCase().includes(s)
        );
    });
    const visibleLogs = filteredLogs;
    const selectedProducedFood = producedFoods.find(p => p._id === form.produced_food_id);
    const selectedFoodLog = foodLogs.find(f => f._id === form.food_log_id);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">Експедиция на храни</h1>

            <div className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select name="object_id" value={form.object_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => <option key={o._id} value={o._id}>{o.name} ({OBJECT_TYPE_LABELS[o.object_type]})</option>)}
                </select>
            </div>

            {form.object_id && (
                <>
                    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Добави нова експедиция</h2>

                        {shipmentType && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Тип:</strong>{" "}
                                    <span className={`inline-block px-2 py-1 rounded text-xs ml-1 ${shipmentType === "wholesale" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
                                        {OBJECT_TYPE_LABELS[shipmentType]}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Дата и час <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                            </div>

                            {shipmentType === "wholesale" && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Храна (от дневник 3.3.1) <span className="text-red-500">*</span></label>
                                    <select name="food_log_id" value={form.food_log_id} onChange={onFoodLogChange} required className="border px-3 py-2 rounded-md w-full">
                                        <option value="">-- Избери храна --</option>
                                        {foodLogs.map(f => <option key={f._id} value={f._id}>{f.product_type} | Партида: {f.batch_number} | {fmtDate(f.shelf_life)}</option>)}
                                    </select>
                                    {selectedFoodLog && (
                                        <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3 text-sm space-y-1">
                                            <div><span className="text-gray-500">Партида:</span> <span className="font-medium">{selectedFoodLog.batch_number}</span></div>
                                            <div><span className="text-gray-500">Срок:</span> <span className="font-medium">{fmtDate(selectedFoodLog.shelf_life)}</span></div>
                                            {selectedFoodLog.quantity && <div><span className="text-gray-500">Количество:</span> <span className="font-medium">{selectedFoodLog.quantity}</span></div>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {shipmentType === "catering" && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Готова храна (от дневник 3.3.7) <span className="text-red-500">*</span></label>
                                    <select name="produced_food_id" value={form.produced_food_id} onChange={onProducedFoodChange} required className="border px-3 py-2 rounded-md w-full">
                                        <option value="">-- Избери готова храна --</option>
                                        {producedFoods.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {p.recipe_id?.name || "Без ime"}{p.product_batch_number ? ` | ${p.product_batch_number}` : ""}{` | ${new Date(p.date).toLocaleDateString("bg-BG")}`}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedProducedFood && (
                                        <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3 text-sm space-y-1">
                                            {selectedProducedFood.product_batch_number && <div><span className="text-gray-500">Партида:</span> <span className="font-medium">{selectedProducedFood.product_batch_number}</span></div>}
                                            {selectedProducedFood.product_shelf_life && <div><span className="text-gray-500">Срок:</span> <span className="font-medium">{fmtDate(selectedProducedFood.product_shelf_life)}</span></div>}
                                            {selectedProducedFood.portions && <div><span className="text-gray-500">Порции:</span> <span className="font-medium">{selectedProducedFood.portions}</span></div>}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Количество <span className="text-red-500">*</span></label>
                                <input type="number" step="0.01" name="quantity" value={form.quantity} onChange={onChange} placeholder="Количество" required className="border px-3 py-2 rounded-md w-full" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Фирма получател</label>
                                <select name="client_id" value={form.client_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                                    <option value="">-- Избери получател --</option>
                                    {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            {shipmentType === "catering" && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Партиден номер</label>
                                    <input disabled name="product_batch_number" value={form.product_batch_number} placeholder="Автоматично при избор на храна" className="border px-3 py-2 rounded-md w-full bg-slate-100 text-slate-700" />
                                    {form.product_batch_number && <p className="text-xs text-blue-600 mt-1">✓ Автоматично от дневник 3.3.7</p>}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Документ</label>
                                <input name="document" value={form.document} onChange={onChange} placeholder="Документ" className="border px-3 py-2 rounded-md w-full" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Служител</label>
                                <select name="employee_id" value={form.employee_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                                    <option value="">-- Избери служител --</option>
                                    {employees.map(e => <option key={e._id} value={e._id}>{e.first_name} {e.last_name}</option>)}
                                </select>
                            </div>
                        </div>

                        {error && <div className="bg-red-50 border border-red-200 rounded-md p-3"><p className="text-red-700 text-sm">{error}</p></div>}

                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Запази</button>
                        </div>
                    </form>

                    <div>
                        <label className="block text-sm font-medium mb-2">Търсене</label>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по храна, получател..." className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div className="space-y-4">
                        {visibleLogs.map(l => (
                            <div key={l._id} className="bg-white border rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-semibold">
                                            {l.food_log_id ? l.food_log_id.product_type : (l.produced_food_id?.recipe_id?.name || "Без ime")}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded ${l.food_log_id ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                                            {l.food_log_id ? "Търговия на едро" : "Кетъринг"}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 text-sm shrink-0 ml-2">
                                        <button onClick={() => setEditingLog(l)} className="text-blue-600 hover:text-blue-800">Редактирай</button>
                                        <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800">Изтрий</button>
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm text-slate-600">
                                    <div>Количество: <span className="font-medium">{l.quantity}</span></div>
                                    {l.food_log_id && <>
                                        <div>Партида: <span className="font-medium">{l.food_log_id.batch_number}</span></div>
                                        {l.food_log_id.shelf_life && <div>Срок: <span className="font-medium">{fmtDate(l.food_log_id.shelf_life)}</span></div>}
                                    </>}
                                    {l.produced_food_id && <>
                                        {l.produced_food_id.product_batch_number && <div>Партида: <span className="font-medium">{l.produced_food_id.product_batch_number}</span></div>}
                                        {l.produced_food_id.product_shelf_life && <div>Срок: <span className="font-medium">{fmtDate(l.produced_food_id.product_shelf_life)}</span></div>}
                                        {l.produced_food_id.portions && <div>Порции: <span className="font-medium">{l.produced_food_id.portions}</span></div>}
                                    </>}
                                    {l.client_id && <div>Получател: <span className="font-medium">{l.client_id.name}</span></div>}
                                    {l.document && <div>Документ: <span className="font-medium">{l.document}</span></div>}
                                    {l.employee_id && <div>Служител: <span className="font-medium">{l.employee_id.first_name} {l.employee_id.last_name}</span></div>}
                                    <div className="text-xs text-slate-400 pt-1">{new Date(l.date).toLocaleString("bg-BG")}</div>
                                </div>
                            </div>
                        ))}
                        {visibleLogs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">Няма записи</p>}
                    </div>
                </>
            )}

            {form.object_id && logs.length > 0 && totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-4 items-center">
                    <button
                        onClick={() => loadLogs(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Назад
                    </button>

                    <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => loadLogs(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Напред
                    </button>
                </div>
            )}

            {editingLog && (
                <ShipmentEditModal
                    log={editingLog}
                    foodLogs={foodLogs}
                    producedFoods={producedFoods}
                    clients={clients}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={() => loadLogs(currentPage)}
                />
            )}
        </div>
    );
}