import { useEffect, useState } from "react";
import { addUserToFirm } from "../../services/adminService";
import { getObjects } from "../../services/objectService";

export default function CreateUserForFirmModal({ firm, onClose, onCreated }) {
    const [objects, setObjects] = useState([]);
    const availableManagerObjects = objects.filter((obj) => !obj.mol_user_id);
    const [loadingObjects, setLoadingObjects] = useState(true);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "owner",
        object_id: "",
        active: true,
    });

    useEffect(() => {
        loadFirmObjects();
    }, [firm._id]);

    const loadFirmObjects = async () => {
        setLoadingObjects(true);
        try {
            const allObjects = await getObjects();

            const firmObjects = allObjects.filter(
                (obj) => obj.firm_id?._id === firm._id
            );

            setObjects(firmObjects);
        } catch (err) {
            alert("Грешка при зареждане на обектите");
        } finally {
            setLoadingObjects(false);
        }
    };

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
        if (form.role === "manager" && !form.object_id) {
            alert("Избери свободен обект за manager");
            setLoading(false);
            return;
        }

        const payload = {
            username: form.username,
            password: form.password,
            name: form.name,
            email: form.email,
            role: form.role,
            active: form.active,
        };

        if (form.role === "manager") {
            payload.object_id = form.object_id;
        }

        await addUserToFirm(firm._id, payload);
        onCreated();
        onClose();
    } catch (err) {
        alert(err.response?.data?.message || "Грешка при създаване на потребител");
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
                            Добавяне на потребител
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Фирма: {firm.name}
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Име
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Потребителско име
                            </label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Парола
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Имейл
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Роля
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={(e) =>
                                    setForm((s) => ({
                                        ...s,
                                        role: e.target.value,
                                        object_id: e.target.value === "manager" ? s.object_id : "",
                                    }))
                                }
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="owner">Owner</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        {form.role === "manager" && (
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Обект
                                </label>
                                <select
                                    name="object_id"
                                    value={form.object_id}
                                    onChange={onChange}
                                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                    disabled={loadingObjects || availableManagerObjects.length === 0}
                                >
                                    <option value="">
                                        {loadingObjects
                                            ? "Зареждане..."
                                            : availableManagerObjects.length === 0
                                                ? "Няма свободни обекти"
                                                : "Избери обект"}
                                    </option>

                                    {availableManagerObjects.map((object) => (
                                        <option key={object._id} value={object._id}>
                                            {object.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-xs text-slate-500 mt-1">
                                    Показват се само обекти без назначен МОЛ.
                                </p>
                            </div>
                        )}

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={onChange}
                            />
                            Активен
                        </label>

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