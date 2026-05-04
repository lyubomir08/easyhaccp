import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../../services/userService";
import { getAllFirms } from "../../../services/firmService";
import { getObjects } from "../../../services/objectService";

export default function EditUserModal({ userId, onClose, onUpdated }) {
    const [user, setUser] = useState(null);
    const [firms, setFirms] = useState([]);
    const [objects, setObjects] = useState([]);
    const [filteredObjects, setFilteredObjects] = useState([]);
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        role: "",
        firm_id: "",
        object_id: "",
        active: false,
    });

    useEffect(() => {
        loadUser();
        loadFirms();
        loadObjects();
    }, [userId]);

    useEffect(() => {
        if (form.firm_id) {
            setFilteredObjects(objects.filter(o => o.firm_id === form.firm_id || o.firm_id?._id === form.firm_id));
        } else {
            setFilteredObjects(objects);
        }
    }, [form.firm_id, objects]);

    const loadUser = async () => {
        try {
            const data = await getUserById(userId);
            setUser(data);
            setForm({
                username: data.username || "",
                name: data.name || "",
                email: data.email || "",
                role: data.role || "",
                firm_id: data.firm_id?._id || data.firm_id || "",
                object_id: data.object_id?._id || data.object_id || "",
                active: data.active,
            });
        } catch (err) {
            alert("Грешка при зареждане на потребителя");
            onClose();
        }
    };

    const loadFirms = async () => {
        try {
            const data = await getAllFirms();
            setFirms(data);
        } catch {}
    };

    const loadObjects = async () => {
        try {
            const data = await getObjects();
            setObjects(data);
        } catch {}
    };

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(s => {
            const updated = {
                ...s,
                [name]: type === "checkbox" ? checked : value,
            };
            if (name === "firm_id") updated.object_id = "";
            return updated;
        });
    };

    const onSubmit = async () => {
        try {
            const payload = {
                ...form,
                object_id: form.object_id || null,
                firm_id: form.firm_id || null,
            };
            await updateUser(userId, payload);
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при запис");
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-bold text-black">Редакция на потребител</h2>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Име</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Потребител</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Имейл</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Фирма</label>
                            <select
                                name="firm_id"
                                value={form.firm_id}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">— Без фирма —</option>
                                {firms.map(f => (
                                    <option key={f._id} value={f._id}>{f.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Обект</label>
                            <select
                                name="object_id"
                                value={form.object_id}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">— Без обект —</option>
                                {filteredObjects.map(o => (
                                    <option key={o._id} value={o._id}>{o.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Роля</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="owner">Собственик</option>
                                <option value="manager">Мениджър</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={onChange}
                            />
                            Активен
                        </label>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded"
                            >
                                Отказ
                            </button>
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Запази
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}