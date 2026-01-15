import { useState } from "react";
import { updateFirm } from "../../services/firmService";

export default function EditMyFirmModal({ firm, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: firm.name || "",
        mol: firm.mol || "",
        phone: firm.phone || "",
        email: firm.email || "",
        vat_registered: firm.vat_registered || false,
    });

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(s => ({
            ...s,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateFirm(firm._id, form);
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
                <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            Редакция на фирма
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">

                        <Field label="Име на фирмата">
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="input"
                                required
                            />
                        </Field>

                        <Field label="МОЛ">
                            <input
                                name="mol"
                                value={form.mol}
                                onChange={onChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Телефон">
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Имейл">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                className="input"
                            />
                        </Field>

                        {/* <label className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                name="vat_registered"
                                checked={form.vat_registered}
                                onChange={onChange}
                            />
                            ДДС регистрирана фирма
                        </label> */}

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