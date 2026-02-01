import { useEffect, useState } from "react";
import api from "../../../services/api";
import PersonalHygieneEditModal from "./PersonalHygieneEditModal";

export default function PersonalHygieneDiary() {
    const [objects, setObjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [editingLog, setEditingLog] = useState(null);

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        employee_id: "",
        health_status: "",
        uniform_status: ""
    });

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => setObjects(res.data));
    }, []);

    /* LOAD EMPLOYEES + LOGS */
    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/employees/${form.object_id}`)
            .then(res => setEmployees(res.data));

        loadLogs();
    }, [form.object_id]);

    const loadLogs = async () => {
        const res = await api.get(
            `/personal-hygiene/${form.object_id}`
        );
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
            await api.post("/personal-hygiene", {
                object_id: form.object_id,
                date: new Date(form.date).toISOString(),
                employee_id: form.employee_id,
                health_status: form.health_status,
                uniform_status: form.uniform_status
            });

            await loadLogs();

            setForm(s => ({
                ...s,
                date: "",
                employee_id: "",
                health_status: "",
                uniform_status: ""
            }));
        } catch (err) {
            console.error("CREATE ERROR:", err.response?.data);
            setError("Грешка при запазване");
        }
    };

    /* DELETE – ⚠️ БЕЗ /delete */
    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте?")) return;

        try {
            await api.delete(`/personal-hygiene/delete/${id}`);
            await loadLogs();
        } catch (err) {
            console.error("DELETE ERROR:", err.response?.data);
            alert("Грешка при изтриване");
        }
    };

    /* SEARCH */
    const filteredLogs = logs.filter(l =>
        `${l.employee_id?.first_name} ${l.employee_id?.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const visibleLogs = search
        ? filteredLogs
        : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Дневник за лична хигиена на персонала
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
                    className="bg-white border rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
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
                        name="employee_id"
                        value={form.employee_id}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">Служител</option>
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="health_status"
                        value={form.health_status}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">Здравен статус</option>
                        <option value="healthy">Здрав</option>
                        <option value="sick">Болен</option>
                    </select>

                    <select
                        name="uniform_status"
                        value={form.uniform_status}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md md:col-span-2"
                    >
                        <option value="">Работно облекло</option>
                        <option value="clean">Чисто</option>
                        <option value="dirty">Замърсено</option>
                    </select>

                    <div className="md:col-span-3 flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">
                            Запази
                        </button>
                    </div>

                    {error && (
                        <p className="md:col-span-3 text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                </form>
            )}

            {/* SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Търси по служител..."
                className="border px-3 py-2 rounded-md w-full"
            />

            {/* LIST */}
            <div className="space-y-4">
                {visibleLogs.map(l => (
                    <div
                        key={l._id}
                        className="bg-white border rounded-xl p-5 flex justify-between"
                    >
                        <div className="space-y-1">
                            <h3 className="font-semibold">
                                {l.employee_id?.first_name} {l.employee_id?.last_name}
                            </h3>

                            <div className="text-sm">
                                Здраве:{" "}
                                <span className={
                                    l.health_status === "sick"
                                        ? "text-red-600 font-medium"
                                        : "text-green-600 font-medium"
                                }>
                                    {l.health_status === "healthy" ? "Здрав" : "Болен"}
                                </span>
                            </div>

                            <div className="text-sm text-slate-600">
                                Облекло: {l.uniform_status === "clean" ? "Чисто" : "Замърсено"}
                            </div>

                            <div className="text-xs text-slate-400">
                                {new Date(l.date).toLocaleString("bg-BG")}
                            </div>
                        </div>

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
                <PersonalHygieneEditModal
                    log={editingLog}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}
