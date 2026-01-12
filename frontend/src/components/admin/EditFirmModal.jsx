import { useState } from "react";
import { updateFirm } from "../../services/firmService";

export default function EditFirmModal({ firm, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: firm.name || "",
        bulstat: firm.bulstat || "",
        mol: firm.mol || "",
        phone: firm.phone || "",
        email: firm.email || "",
        vat_registered: firm.vat_registered || false,
    });

    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((s) => ({
            ...s,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateFirm(firm._id, form);
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при редакция");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Редакция на фирма
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Име на фирмата
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Булстат
                        </label>
                        <input
                            name="bulstat"
                            value={form.bulstat}
                            onChange={onChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            МОЛ
                        </label>
                        <input
                            name="mol"
                            value={form.mol}
                            onChange={onChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Телефон
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Имейл
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-slate-300
                                       text-slate-700 hover:bg-slate-100 transition"
                        >
                            Отказ
                        </button>

                        <button
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-blue-600
                                       text-white hover:bg-blue-700 transition
                                       disabled:opacity-50"
                        >
                            {loading ? "Запис..." : "Запази"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
