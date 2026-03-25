import { useState } from "react";
import api from "../../../services/api";

export default function TrainingEditModal({ training, employees, onClose, onSaved }) {
    const [form, setForm] = useState({
        topic: training.topic || "",
        lecturer: training.lecturer || "",
        date: training.date ? String(training.date).split("T")[0] : "",
        selectedEmployees: training.participants.map(p => ({
            _id: p.employee_id?._id,
            first_name: p.employee_id?.first_name,
            last_name: p.employee_id?.last_name,
            position: p.employee_id?.position || p.position || ""
        })).filter(e => e._id)
    });

    const [error, setError] = useState("");

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
            await api.put(`/trainings/edit/${training._id}`, {
                topic: form.topic,
                lecturer: form.lecturer || undefined,
                date: new Date(form.date).toISOString(),
                participants: form.selectedEmployees.map(emp => ({
                    employee_id: emp._id,
                    position: emp.position || ""
                }))
            });
            await onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при актуализация");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Редакция на обучение</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Тема <span className="text-red-500">*</span></label>
                        <input name="topic" value={form.topic} onChange={onChange} required placeholder="Тема на обучението" className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Лектор</label>
                        <input name="lecturer" value={form.lecturer} onChange={onChange} placeholder="Лектор (по желание)" className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Дата <span className="text-red-500">*</span></label>
                        <input type="date" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Присъствали служители <span className="text-red-500">*</span></label>
                            <div className="flex gap-3 text-sm">
                                <button type="button" onClick={selectAll} className="text-blue-600 hover:text-blue-800">Избери всички</button>
                                <button type="button" onClick={clearAll} className="text-slate-500 hover:text-slate-700">Изчисти</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">Отказ</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Запази</button>
                    </div>
                </form>
            </div>
        </div>
    );
}