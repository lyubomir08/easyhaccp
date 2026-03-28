import { useState } from "react";
import { addObjectToFirm } from "../../services/adminService";

export default function CreateObjectForFirmModal({ firm, onClose, onCreated }) {
    const [form, setForm] = useState({
        name: "",
        address: "",
        working_hours: "",
        object_type: "restaurant",
    });

    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]: value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addObjectToFirm(firm._id, form);
            onCreated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при създаване на обект");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            Добавяне на обект
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Фирма: {firm.name}
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Име на обекта
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2
                                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Адрес
                            </label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2
                                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Работно време
                            </label>
                            <input
                                name="working_hours"
                                value={form.working_hours}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2
                                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Тип обект
                            </label>
                            <select
                                name="object_type"
                                value={form.object_type}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2
                                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="restaurant">Ресторант</option>
                                <option value="retail">Търговия на дребно</option>
                                <option value="wholesale">Търговия на едро</option>
                                <option value="catering">Кетъринг</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-md text-black hover:bg-slate-100"
                            >
                                Отказ
                            </button>

                            <button
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md
                                           hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Запис..." : "Създай"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}