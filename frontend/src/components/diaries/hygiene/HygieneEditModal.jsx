import { useState } from "react";
import api from "../../../services/api";

export default function HygieneEditModal({
    log,
    rooms,
    disinfectants,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        date: log.date.slice(0, 16),
        room_id: log.room_id?._id,
        disinfectant_id: log.disinfectant_id?._id,
        employee_id: log.employee_id?._id
    });

    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(`/hygiene-logs/edit/${log._id}`, form);
            await onSaved();
            onClose();
        } catch {
            setError("Грешка при редактиране");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
                <h2 className="text-lg font-medium">Редактиране</h2>

                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        type="datetime-local"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <select name="room_id" value={form.room_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                        {rooms.map(r => (
                            <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                    </select>

                    <select name="disinfectant_id" value={form.disinfectant_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                        {disinfectants.map(d => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>

                    <select name="employee_id" value={form.employee_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2">
                            Отказ
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
