import { useEffect, useState } from "react";
import api from "../../../services/api";
import FridgeTemperatureEditModal from "./FridgeTemperatureEditModal";

export default function FridgeTemperatureDiary() {
    const [objects, setObjects] = useState([]);
    const [fridges, setFridges] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    
    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        object_id: "",
        fridge_id: "",
        date: "",
        measured_temp: "",
        corrective_action: "",
        employee_id: ""
    });

    // Selected fridge for displaying norm
    const selectedFridge = fridges.find(f => f._id === form.fridge_id);

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => setObjects(res.data));
    }, []);

    /* LOAD DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/fridges/${form.object_id}`).then(r => setFridges(r.data));
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data));
        loadLogs();
    }, [form.object_id]);

    /* LOAD LOGS */
    const loadLogs = async () => {
        const res = await api.get(`/fridge-logs/${form.object_id}`);
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
            await api.post("/fridge-logs", {
                ...form,
                measured_temp: Number(form.measured_temp)
            });
            
            await loadLogs();
            
            setForm(s => ({
                ...s,
                date: "",
                fridge_id: "",
                measured_temp: "",
                corrective_action: "",
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
            await api.delete(`/fridge-logs/delete/${id}`);
            await loadLogs();
        } catch {
            alert("Грешка при изтриване");
        }
    };

    /* SEARCH */
    const filteredLogs = logs.filter(l =>
        l.fridge_id?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">
                Дневник за температура на хладилни съоръжения
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
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
                                Хладилник <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="fridge_id"
                                value={form.fridge_id}
                                onChange={onChange}
                                required
                                className="border px-3 py-2 rounded-md w-full"
                            >
                                <option value="">-- Избери хладилник --</option>
                                {fridges.map(f => (
                                    <option key={f._id} value={f._id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Норма</label>
                            <input
                                disabled
                                value={selectedFridge ? `${selectedFridge.norm_min}°C / ${selectedFridge.norm_max}°C` : "−2°C / +4°C"}
                                className="border px-3 py-2 rounded-md w-full bg-slate-100 text-slate-700 font-medium"
                            />
                            {selectedFridge && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Норма за избрания хладилник
                                </p>
                            )}
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
                                placeholder="Стойност °C"
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
                            <label className="block text-sm font-medium mb-1">Мерки при отклонение</label>
                            <input
                                name="corrective_action"
                                value={form.corrective_action}
                                onChange={onChange}
                                placeholder="Мерки при отклонение"
                                className="border px-3 py-2 rounded-md w-full"
                            />
                        </div>
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
                        placeholder="Търси по хладилник..."
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
                                    {l.fridge_id?.name || "Неизвестен хладилник"}
                                </h3>

                                <div className="text-sm text-slate-600">
                                    Норма:{" "}
                                    <span className="font-medium text-slate-800">
                                        {l.fridge_id?.norm_min}°C / {l.fridge_id?.norm_max}°C
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    Температура:{" "}
                                    <span
                                        className={
                                            l.measured_temp < (l.fridge_id?.norm_min || -2) || 
                                            l.measured_temp > (l.fridge_id?.norm_max || 4)
                                                ? "text-red-600 font-semibold"
                                                : "text-green-600 font-medium"
                                        }
                                    >
                                        {l.measured_temp} °C
                                    </span>
                                    {(l.measured_temp < (l.fridge_id?.norm_min || -2) || 
                                      l.measured_temp > (l.fridge_id?.norm_max || 4)) && (
                                        <span className="ml-2 text-red-600 text-xs">⚠ Извън норма</span>
                                    )}
                                </div>

                                <div className="text-sm text-slate-600">
                                    Служител:{" "}
                                    <span className="font-medium text-slate-800">
                                        {l.employee_id
                                            ? `${l.employee_id.first_name} ${l.employee_id.last_name}`
                                            : "Не е посочен"}
                                    </span>
                                </div>

                                {l.corrective_action && (
                                    <div className="text-sm text-slate-600">
                                        Мерки:{" "}
                                        <span className="font-medium text-slate-800">
                                            {l.corrective_action}
                                        </span>
                                    </div>
                                )}

                                <div className="text-xs text-slate-400 pt-1">
                                    {new Date(l.date).toLocaleString("bg-BG")}
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
                <FridgeTemperatureEditModal
                    log={editingLog}
                    fridges={fridges}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}