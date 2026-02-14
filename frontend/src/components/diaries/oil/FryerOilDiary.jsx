import { useEffect, useState } from "react";
import api from "../../../services/api";
import FryerOilEditModal from "./FryerOilEditModal";

export default function FryerOilDiary() {
    const [objects, setObjects] = useState([]);
    const [fryers, setFryers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [editingLog, setEditingLog] = useState(null);

    const [form, setForm] = useState({
        object_id: "",
        fryer_id: "",
        oil_type: "",
        load_datetime: "",
        load_quantity: "",
        change_datetime: "",
        change_quantity: "",
        employee_id: ""
    });

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => setObjects(res.data));
    }, []);

    /* LOAD DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/fryers/${form.object_id}`).then(res => setFryers(res.data));
        api.get(`/employees/${form.object_id}`).then(res => setEmployees(res.data));
        loadLogs();
    }, [form.object_id]);

    /* LOAD LOGS */
    const loadLogs = async () => {
        const res = await api.get(`/fryer-oil/${form.object_id}`);
        setLogs(res.data);
    };

    const onChange = (e) => {
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }));
    };

    /* CREATE */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/fryer-oil", {
                object_id: form.object_id,
                fryer_id: form.fryer_id,
                oil_type: form.oil_type || null,
                load_datetime: form.load_datetime ? new Date(form.load_datetime).toISOString() : null,
                load_quantity: form.load_quantity ? Number(form.load_quantity) : null,
                change_datetime: form.change_datetime ? new Date(form.change_datetime).toISOString() : null,
                change_quantity: form.change_quantity ? Number(form.change_quantity) : null,
                employee_id: form.employee_id || null
            });

            await loadLogs();

            setForm(s => ({
                ...s,
                fryer_id: "",
                oil_type: "",
                load_datetime: "",
                load_quantity: "",
                change_datetime: "",
                change_quantity: "",
                employee_id: ""
            }));
        } catch (err) {
            console.error(err.response?.data);
            setError("Грешка при запазване");
        }
    };

    /* DELETE */
    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте?")) return;

        try {
            await api.delete(`/fryer-oil/delete/${id}`);
            await loadLogs();
        } catch (err) {
            console.error("DELETE ERROR:", err.response?.data);
            alert("Грешка при изтриване");
        }
    };

    /* SEARCH */
    const filteredLogs = logs.filter(l =>
        l.fryer_id?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">
                Дневник – Смяна на мазнина
            </h1>

            {/* OBJECT */}
            <div className="bg-white border rounded-xl p-4">
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
            </div>

            {/* FORM */}
            {form.object_id && (
                <form
                    onSubmit={onSubmit}
                    className="bg-white border rounded-xl p-6 space-y-4"
                >
                    <h2 className="text-lg font-semibold">Добави нов запис</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Фритюрник <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="fryer_id"
                                value={form.fryer_id}
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери фритюрник --</option>
                                {fryers.map(f => (
                                    <option key={f._id} value={f._id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Използвана мазнина
                            </label>
                            <input
                                name="oil_type"
                                value={form.oil_type}
                                onChange={onChange}
                                placeholder="Въведи тип мазнина"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Дата и час на зареждане
                            </label>
                            <input
                                type="datetime-local"
                                name="load_datetime"
                                value={form.load_datetime}
                                onChange={onChange}
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Литри (зареждане)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="load_quantity"
                                value={form.load_quantity}
                                onChange={onChange}
                                placeholder="0.0"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Дата и час на смяна
                            </label>
                            <input
                                type="datetime-local"
                                name="change_datetime"
                                value={form.change_datetime}
                                onChange={onChange}
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Литри (смяна)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="change_quantity"
                                value={form.change_quantity}
                                onChange={onChange}
                                placeholder="0.0"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Служител
                        </label>
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
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            )}

            {/* SEARCH */}
            {form.object_id && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Търси по фритюрник..."
                        className="border px-3 py-2 rounded-md w-full"
                    />
                </div>
            )}

            {/* LIST */}
            {form.object_id && (
                <div className="space-y-4">
                    {visibleLogs.map(l => (
                        <div
                            key={l._id}
                            className="bg-white border rounded-xl p-5 flex justify-between items-start"
                        >
                            {/* LEFT */}
                            <div className="space-y-1 flex-1">
                                <h3 className="text-lg font-semibold">
                                    {l.fryer_id?.name || "Неизвестен фритюрник"}
                                </h3>
                                
                                {l.oil_type && (
                                    <div className="text-sm text-slate-600">
                                        Използвана мазнина:{" "}
                                        <span className="font-medium text-slate-800">
                                            {l.oil_type}
                                        </span>
                                    </div>
                                )}

                                <div className="text-sm text-slate-600">
                                    Зареждане:{" "}
                                    <span className="font-medium text-slate-800">
                                        {l.load_datetime
                                            ? new Date(l.load_datetime).toLocaleString("bg-BG")
                                            : "—"}
                                        {l.load_quantity && ` | ${l.load_quantity} л`}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    Смяна:{" "}
                                    <span className="font-medium text-slate-800">
                                        {l.change_datetime
                                            ? new Date(l.change_datetime).toLocaleString("bg-BG")
                                            : "—"}
                                        {l.change_quantity && ` | ${l.change_quantity} л`}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    Служител:{" "}
                                    <span className="font-medium text-slate-800">
                                        {l.employee_id
                                            ? `${l.employee_id.first_name} ${l.employee_id.last_name}`
                                            : "Не е посочен"}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex gap-3 text-sm ml-4">
                                <button
                                    onClick={() => setEditingLog(l)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Редактирай
                                </button>
                                <button
                                    onClick={() => onDelete(l._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Изтрий
                                </button>
                            </div>
                        </div>
                    ))}

                    {visibleLogs.length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-8">
                            Няма записи
                        </p>
                    )}

                    {!search && logs.length > 10 && (
                        <p className="text-slate-500 text-sm text-center">
                            Показани са последните 10 записа. Използвайте търсенето за повече резултати.
                        </p>
                    )}
                </div>
            )}

            {/* EDIT MODAL */}
            {editingLog && (
                <FryerOilEditModal
                    log={editingLog}
                    fryers={fryers}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}