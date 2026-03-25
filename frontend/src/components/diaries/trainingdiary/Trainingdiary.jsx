import { useEffect, useState } from "react";
import api from "../../../services/api";
import TrainingEditModal from "./TrainingEditModal";

export default function TrainingDiary() {
    const [objects, setObjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [editingTraining, setEditingTraining] = useState(null);

    const [form, setForm] = useState({
        object_id: "",
        topic: "",
        lecturer: "",
        date: "",
        selectedEmployees: []
    });

    useEffect(() => {
        api.get("/objects").then(res => {
            setObjects(res.data);
            if (res.data.length === 1) setForm(s => ({ ...s, object_id: res.data[0]._id }));
        });
    }, []);

    useEffect(() => {
        if (!form.object_id) return;
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data)).catch(() => {});
        loadTrainings();
    }, [form.object_id]);

    const loadTrainings = async () => {
        if (!form.object_id) return;
        try {
            const res = await api.get(`/trainings/${form.object_id}`);
            setTrainings(res.data);
        } catch { setTrainings([]); }
    };

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const toggleEmployee = (emp) => {
        setForm(s => ({
            ...s,
            selectedEmployees: s.selectedEmployees.find(e => e._id === emp._id)
                ? s.selectedEmployees.filter(e => e._id !== emp._id)
                : [...s.selectedEmployees, emp]
        }));
    };

    const selectAll = () => setForm(s => ({ ...s, selectedEmployees: [...employees] }));
    const clearAll = () => setForm(s => ({ ...s, selectedEmployees: [] }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.selectedEmployees.length === 0) {
            setError("Изберете поне един служител");
            return;
        }
        try {
            await api.post("/trainings", {
                object_id: form.object_id,
                topic: form.topic,
                lecturer: form.lecturer || undefined,
                date: new Date(form.date).toISOString(),
                participants: form.selectedEmployees.map(emp => ({
                    employee_id: emp._id,
                    position: emp.position || ""
                }))
            });
            await loadTrainings();
            setForm(s => ({ ...s, topic: "", lecturer: "", date: "", selectedEmployees: [] }));
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте?")) return;
        try {
            await api.delete(`/trainings/delete/${id}`);
            await loadTrainings();
        } catch { alert("Грешка при изтриване"); }
    };

    const filtered = trainings.filter(t =>
        t.topic?.toLowerCase().includes(search.toLowerCase()) ||
        t.lecturer?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">Обучения на служителите</h1>

            <div className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select name="object_id" value={form.object_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
            </div>

            {form.object_id && (
                <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Добави обучение</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Тема <span className="text-red-500">*</span></label>
                            <input name="topic" value={form.topic} onChange={onChange} required placeholder="Тема на обучението" className="border px-3 py-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Дата <span className="text-red-500">*</span></label>
                            <input type="date" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium mb-1">Лектор</label>
                            <input name="lecturer" value={form.lecturer} onChange={onChange} placeholder="Лектор (по желание)" className="border px-3 py-2 rounded-md w-full" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Присъствали служители <span className="text-red-500">*</span></label>
                            <div className="flex gap-3 text-sm">
                                <button type="button" onClick={selectAll} className="text-blue-600 hover:text-blue-800">Избери всички</button>
                                <button type="button" onClick={clearAll} className="text-slate-500 hover:text-slate-700">Изчисти</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {employees.map(emp => (
                                <label key={emp._id} className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm ${form.selectedEmployees.find(e => e._id === emp._id) ? "bg-blue-50 border-blue-300" : "border-slate-200 hover:bg-slate-50"}`}>
                                    <input
                                        type="checkbox"
                                        checked={!!form.selectedEmployees.find(e => e._id === emp._id)}
                                        onChange={() => toggleEmployee(emp)}
                                        className="accent-blue-600"
                                    />
                                    <span>{emp.first_name} {emp.last_name}</span>
                                    {emp.position && <span className="text-slate-400 text-xs">· {emp.position}</span>}
                                </label>
                            ))}
                        </div>
                        {form.selectedEmployees.length > 0 && (
                            <p className="text-xs text-blue-600 mt-2">✓ Избрани: {form.selectedEmployees.length} служителя</p>
                        )}
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 rounded-md p-3"><p className="text-red-700 text-sm">{error}</p></div>}

                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Запази</button>
                    </div>
                </form>
            )}

            {form.object_id && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по тема или лектор..." className="border px-3 py-2 rounded-md w-full" />
                </div>
            )}

            <div className="space-y-4">
                {filtered.map(t => (
                    <div key={t._id} className="bg-white border rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-base font-semibold text-slate-800">{t.topic}</h3>
                                {t.lecturer && <p className="text-sm text-slate-500 mt-0.5">Лектор: {t.lecturer}</p>}
                                <p className="text-xs text-slate-400 mt-1">{new Date(t.date).toLocaleDateString("bg-BG")}</p>
                            </div>
                            <div className="flex gap-3 text-sm shrink-0 ml-4">
                                <button onClick={() => setEditingTraining(t)} className="text-blue-600 hover:text-blue-800">Редактирай</button>
                                <button onClick={() => onDelete(t._id)} className="text-red-600 hover:text-red-800">Изтрий</button>
                            </div>
                        </div>
                        <div className="border-t pt-3">
                            <p className="text-xs font-medium text-slate-500 mb-2">ПРИСЪСТВАЛИ ({t.participants.length})</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                                {t.participants.map((p, i) => (
                                    <div key={i} className="text-sm text-slate-700 flex items-center gap-1">
                                        <span className="text-slate-400 text-xs">{i + 1}.</span>
                                        <span>{p.employee_id?.first_name} {p.employee_id?.last_name}</span>
                                        {p.position && <span className="text-slate-400 text-xs">· {p.position}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && form.object_id && (
                    <p className="text-slate-500 text-sm text-center py-8">Няма обучения</p>
                )}
            </div>

            {editingTraining && (
                <TrainingEditModal
                    training={editingTraining}
                    employees={employees}
                    onClose={() => setEditingTraining(null)}
                    onSaved={loadTrainings}
                />
            )}
        </div>
    );
}