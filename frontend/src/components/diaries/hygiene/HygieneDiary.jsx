import { useEffect, useState } from "react";
import api from "../../../services/api";
import HygieneEditModal from "./HygieneEditModal";

export default function HygieneDiary() {
    const [objects, setObjects] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [disinfectants, setDisinfectants] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [allLogs, setAllLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [editingLog, setEditingLog] = useState(null);

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        room_id: "",
        disinfectant_id: "",
        employee_id: ""
    });

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => setObjects(res.data));
    }, []);

    /* LOAD DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/rooms/${form.object_id}`).then(r => setRooms(r.data));
        api.get(`/disinfectants/${form.object_id}`).then(r => setDisinfectants(r.data));
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data));
        loadLogs();
    }, [form.object_id]);

    const loadLogs = async () => {
        const res = await api.get(`/hygiene-logs/${form.object_id}`);
        setAllLogs(res.data);
    };

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/hygiene-logs", form);
            await loadLogs();

            setForm(s => ({
                ...s,
                date: "",
                room_id: "",
                disinfectant_id: "",
                employee_id: ""
            }));
        } catch {
            setError("Грешка при запазване");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте?")) return;

        try {
            await api.delete(`/hygiene-logs/delete/${id}`);
            await loadLogs();
        } catch {
            alert("Грешка при изтриване");
        }
    };

    const filteredLogs = allLogs.filter(l => {
        const text = search.toLowerCase();
        return (
            l.room_id?.name?.toLowerCase().includes(text) ||
            l.disinfectant_id?.name?.toLowerCase().includes(text)
        );
    });

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Дневник за хигиена на обекта</h1>

            <section className="bg-white border rounded-xl p-4">
                <select
                    name="object_id"
                    value={form.object_id}
                    onChange={onChange}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {form.object_id && (
                <section className="bg-white border rounded-xl p-6">
                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input
                            type="datetime-local"
                            name="date"
                            value={form.date}
                            onChange={onChange}
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <select name="room_id" value={form.room_id} onChange={onChange} required className="border px-3 py-2 rounded-md">
                            <option value="">Помещение</option>
                            {rooms.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>

                        <select name="disinfectant_id" value={form.disinfectant_id} onChange={onChange} required className="border px-3 py-2 rounded-md">
                            <option value="">Препарат</option>
                            {disinfectants.map(d => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>

                        <select name="employee_id" value={form.employee_id} onChange={onChange} required className="border px-3 py-2 rounded-md md:col-span-2">
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

                        {error && <p className="md:col-span-3 text-red-500 text-sm">{error}</p>}
                    </form>
                </section>
            )}

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Търси по помещение или препарат..."
                className="border px-3 py-2 rounded-md w-full"
            />

            <div className="space-y-3">
                {visibleLogs.map(l => (
                    <div key={l._id} className="bg-white border rounded-lg p-4 flex justify-between">
                        <div>
                            <strong>{l.room_id?.name}</strong>
                            <div className="text-sm text-slate-600">
                                Препарат: {l.disinfectant_id?.name}
                            </div>
                            <div className="text-sm text-slate-600">
                                Служител: {l.employee_id?.first_name} {l.employee_id?.last_name}
                            </div>
                            <div className="text-xs text-slate-400">
                                Създаден: {new Date(l.created_at).toLocaleString("bg-BG")}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingLog(l)}
                                className="text-blue-600 text-sm"
                            >
                                Редактирай
                            </button>
                            <button
                                onClick={() => onDelete(l._id)}
                                className="text-red-600 text-sm"
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
                <HygieneEditModal
                    log={editingLog}
                    rooms={rooms}
                    disinfectants={disinfectants}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}
