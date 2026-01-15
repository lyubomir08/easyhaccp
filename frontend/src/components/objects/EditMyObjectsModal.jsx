import { useEffect, useState } from "react";
import { getObjectById, updateObject } from "../../services/objectService";

export default function EditMyObjectsModal({ objectId, onClose, onUpdated }) {
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (objectId) loadObject();
    }, [objectId]);

    const loadObject = async () => {
        const data = await getObjectById(objectId);
        setForm({
            name: data.name || "",
            address: data.address || "",
            working_hours: data.working_hours || "",
            object_type: data.object_type || "",
        });
    };

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await updateObject(objectId, form);
        onUpdated();
        onClose();
    };

    if (!form) return null;

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
                            Редакция на обект
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                        <label className="block text-sm font-medium mb-1">
                            Име на обекта
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Име"
                            className="input"
                            required
                        />

                        <label className="block text-sm font-medium mb-1">
                            Адрес
                        </label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={onChange}
                            placeholder="Адрес"
                            className="input"
                        />

                        <label className="block text-sm font-medium mb-1">
                            Работно време
                        </label>
                        <input
                            name="working_hours"
                            value={form.working_hours}
                            onChange={onChange}
                            placeholder="Работно време"
                            className="input"
                        />

                        <label className="block text-sm font-medium mb-1">
                            Тип на обекта
                        </label>
                        <select
                            name="object_type"
                            value={form.object_type}
                            onChange={onChange}
                            className="input"
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
                                Запази
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
