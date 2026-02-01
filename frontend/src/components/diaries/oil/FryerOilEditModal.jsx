import { useState } from "react";
import api from "../../../services/api";

export default function FryerOilEditModal({
    log,
    fryers,
    employees,
    onClose,
    onSaved
}) {
    const [form, setForm] = useState({
        object_id: log.object_id?._id || log.object_id || "",
        fryer_id: log.fryer_id?._id || "",
        oil_type: log.oil_type || "",
        load_datetime: log.load_datetime ? log.load_datetime.slice(0, 16) : "",
        load_quantity: log.load_quantity || "",
        change_datetime: log.change_datetime ? log.change_datetime.slice(0, 16) : "",
        change_quantity: log.change_quantity || "",
        employee_id: log.employee_id?._id || ""
    });

    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }));
    };

    /* EDIT */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(
                `/fryer-oil/edit/${log._id}`,
                {
                    object_id: form.object_id,
                    fryer_id: form.fryer_id,
                    oil_type: form.oil_type || null,
                    load_datetime: form.load_datetime ? new Date(form.load_datetime).toISOString() : null,
                    load_quantity: form.load_quantity ? Number(form.load_quantity) : null,
                    change_datetime: form.change_datetime ? new Date(form.change_datetime).toISOString() : null,
                    change_quantity: form.change_quantity ? Number(form.change_quantity) : null,
                    employee_id: form.employee_id || null
                }
            );

            await onSaved();
            onClose();
        } catch (err) {
            console.error("EDIT ERROR:", err.response?.data);
            setError("Грешка при редактиране");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4">
                <h2 className="text-lg font-medium">
                    Редактиране на запис
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <select
                        name="fryer_id"
                        value={form.fryer_id}
                        onChange={onChange}
                        required
                        className="border px-3 py-2 rounded-md w-full"
                    >
                        <option value="">Фритюрник</option>
                        {fryers.map(f => (
                            <option key={f._id} value={f._id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="oil_type"
                        value={form.oil_type}
                        onChange={onChange}
                        placeholder="Използвана мазнина"
                        className="border px-3 py-2 rounded-md w-full"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="datetime-local"
                            name="load_datetime"
                            value={form.load_datetime}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            type="number"
                            step="0.1"
                            name="load_quantity"
                            value={form.load_quantity}
                            onChange={onChange}
                            placeholder="Литри (зареждане)"
                            className="border px-3 py-2 rounded-md"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="datetime-local"
                            name="change_datetime"
                            value={form.change_datetime}
                            onChange={onChange}
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            type="number"
                            step="0.1"
                            name="change_quantity"
                            value={form.change_quantity}
                            onChange={onChange}
                            placeholder="Литри (смяна)"
                            className="border px-3 py-2 rounded-md"
                        />
                    </div>

                    <select
                        name="employee_id"
                        value={form.employee_id}
                        onChange={onChange}
                        className="border px-3 py-2 rounded-md w-full"
                    >
                        <option value="">Служител</option>
                        {employees.map(e => (
                            <option key={e._id} value={e._id}>
                                {e.first_name} {e.last_name}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border"
                        >
                            Отмени
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white"
                        >
                            Запази
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
