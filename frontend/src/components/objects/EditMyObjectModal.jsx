import { useState } from "react";
import { updateObject } from "../../services/objectService";

export default function EditMyObjectModal({ object, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: object.name || "",
        address: object.address || "",
        working_hours: object.working_hours || "",
        object_type: object.object_type || "",
    });

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateObject(object._id, form);
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при запис");
        }
    };

    return (
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">

                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            Редакция на обект
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">

                        <Field label="Име на обекта">
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="input"
                                required
                            />
                        </Field>

                        <Field label="Адрес">
                            <input
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Работно време">
                            <input
                                name="working_hours"
                                value={form.working_hours}
                                onChange={onChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Тип на обекта">
                            <select
                                name="object_type"
                                value={form.object_type}
                                onChange={onChange}
                                className="input"
                            >
                                <option value="">—</option>
                                <option value="retail">Търговия на дребно</option>
                                <option value="wholesale">Търговия на едро</option>
                                <option value="restaurant">Заведение</option>
                                <option value="catering">Кетъринг</option>
                            </select>
                        </Field>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded"
                            >
                                Отказ
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded
                                           hover:bg-blue-700 transition"
                            >
                                Запази
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}
