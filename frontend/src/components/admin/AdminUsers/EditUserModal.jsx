import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../../services/userService";

export default function EditUserModal({ userId, onClose, onUpdated }) {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        role: "",
        active: false,
    });

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            const data = await getUserById(userId);
            setUser(data);
            setForm({
                role: data.role,
                active: data.active,
            });
        } catch (err) {
            alert("Грешка при зареждане на потребителя");
            onClose();
        }
    };

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
            await updateUser(userId, form);
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при запис");
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-bold text-black">
                            Редакция на потребител
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">

                        {/* USERNAME */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Потребител
                            </label>
                            <input
                                value={user.username}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-slate-100"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Имейл
                            </label>
                            <input
                                value={user.email || "—"}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-slate-100"
                            />
                        </div>

                        {/* FIRM */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Фирма
                            </label>
                            <input
                                value={user.firm_id?.name || "—"}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-slate-100"
                            />
                        </div>

                        {/* OBJECT */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Обект
                            </label>
                            <input
                                value={user.object_id?.name || "—"}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-slate-100"
                            />
                        </div>

                        {/* ROLE */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Роля
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="owner">Owner</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* ACTIVE */}
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={onChange}
                            />
                            Активен
                        </label>

                        {/* ACTIONS */}
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
