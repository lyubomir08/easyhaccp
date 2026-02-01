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
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Дневник за температура на хладилни съоръжения
            </h1>

            {/* OBJECT */}
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

            {/* FORM */}
            {form.object_id && (
                <form
                    onSubmit={onSubmit}
                    className="bg-white border rounded-xl p-6 grid grid-cols-1 md:grid-cols-6 gap-4"
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
                        <option value="">Хладилник</option>
                        {fridges.map(f => (
                            <option key={f._id} value={f._id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    {/* НОРМА (само визуално) */}
                    <input
                        disabled
                        value="−2°C / +4°C"
                        className="border px-3 py-2 rounded-md bg-slate-100"
                    />

                    <input
                        type="number"
                        step="0.1"
                        name="measured_temp"
                        value={form.measured_temp}
                        onChange={onChange}
                        placeholder="Стойност °C"
                        required
                        className="border px-3 py-2 rounded-md"
                    />

                    <select
                        name="employee_id"
                        value={form.employee_id}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">Служител</option>
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
                        className="border px-3 py-2 rounded-md md:col-span-3"
                    />

                    <div className="md:col-span-6 flex justify-end">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                            Запази
                        </button>
                    </div>

                    {error && (
                        <p className="md:col-span-6 text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                </form>
            )}

            {/* SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Търси по хладилник..."
                className="border px-3 py-2 rounded-md w-full"
            />

            {/* LIST – КАРТИ */}
            <div className="space-y-4">
                {visibleLogs.map(l => (
                    <div
                        key={l._id}
                        className="bg-white border rounded-xl p-5 flex justify-between items-start"
                    >
                        {/* LEFT */}
                        <div className="space-y-1">
    <h3 className="text-lg font-semibold">
        {l.fridge_id?.name}
    </h3>

    <div className="text-sm text-slate-600">
        Температура:{" "}
        <span
            className={
                l.measured_temp < -2 || l.measured_temp > 4
                    ? "text-red-600 font-semibold"
                    : "text-slate-800 font-medium"
            }
        >
            {l.measured_temp} °C
        </span>
    </div>

    <div className="text-sm text-slate-600">
        Служител:{" "}
        <span className="font-medium text-slate-800">
            {l.employee_id
                ? `${l.employee_id.first_name} ${l.employee_id.last_name}`
                : "Автоматично"}
        </span>
    </div>

    {l.corrective_action && (
        <div className="text-sm text-slate-600">
            Мерки: {l.corrective_action}
        </div>
    )}

    <div className="text-xs text-slate-400 pt-1">
        Създаден:{" "}
        {new Date(l.created_at || l.date).toLocaleString("bg-BG")}
    </div>
</div>


                        {/* RIGHT */}
                        <div className="flex gap-3 text-sm">
    <button
        onClick={() => setEditingLog(l)}
        className="text-blue-600 hover:underline"
    >
        Редактирай
    </button>
    <button
        onClick={() => onDelete(l._id)}
        className="text-red-600 hover:underline"
    >
        Изтрий
    </button>
</div>

                    </div>
                ))}

                {visibleLogs.length === 0 && (
                    <p className="text-slate-500 text-sm">
                        Няма резултати
                    </p>
                )}
            </div>

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
