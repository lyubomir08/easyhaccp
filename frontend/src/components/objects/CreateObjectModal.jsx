import { useState } from "react";
import { createObject } from "../../services/objectService";

export default function CreateObjectModal({ onClose, onCreated }) {
    const [form, setForm] = useState({
        name: "",
        address: "",
        working_hours: "",
        object_type: "",
    });

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await createObject(form);
        onCreated();
        onClose();
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
                        <h2 className="text-xl font-bold">
                            Нов обект
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                        <label className="block text-sm font-medium mb-1">
                            Име на обекта
                        </label>
                        <input
                            name="name"
                            placeholder="Име"
                            onChange={onChange}
                            className="input"
                            required
                        />

                        <label className="block text-sm font-medium mb-1">
                            Адрес
                        </label>
                        <input
                            name="address"
                            placeholder="Адрес"
                            onChange={onChange}
                            className="input"
                        />

                        <label className="block text-sm font-medium mb-1">
                            Работно време
                        </label>
                        <input
                            name="working_hours"
                            placeholder="Работно време"
                            onChange={onChange}
                            className="input"
                        />

                        <label className="block text-sm font-medium mb-1">
                            Тип на обекта
                        </label>
                        <select
                            name="object_type"
                            onChange={onChange}
                            className="input"
                            required
                        >
                            <option value="">Тип</option>
                            <option value="retail">Търговия на дребно</option>
                            <option value="wholesale">Търговия на едро</option>
                            <option value="restaurant">Заведение</option>
                            <option value="catering">Кетъринг</option>
                        </select>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded"
                            >
                                Отказ
                            </button>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded">
                                Създай
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
