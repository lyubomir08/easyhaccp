import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import EditUserModal from "./EditUserModal";
import useUser from "../../../hooks/useUser";

export default function AdminUsers() {
    const { isAdmin } = useUser();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch {
            alert("Грешка при зареждане на потребителите");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (userId) => {
        if (!confirm("Сигурен ли си, че искаш да изтриеш потребителя?")) return;

        try {
            await deleteUser(userId);
            setUsers(state => state.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">
                Потребители
            </h1>

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && users.length === 0 && (
                <p className="text-slate-500">Няма потребители</p>
            )}

            <div className="space-y-3">
                {users.map(user => (
                    <div
                        key={user._id}
                        className="bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-black">
                                {user.username}
                            </p>
                            <p className="text-sm text-slate-500">
                                Роля: {user.role}
                            </p>
                            {user.firm_id?.name && (
                                <p className="text-sm text-slate-500">
                                    Фирма: {user.firm_id.name}
                                </p>
                            )}
                            {user.object_id?.name && (
                                <p className="text-sm text-slate-500">
                                    Обект: {user.object_id.name}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingUser(user._id)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md"
                            >
                                Редактирай
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => onDelete(user._id)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                >
                                    Изтрий
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {editingUser && (
                <EditUserModal
                    userId={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdated={loadUsers}
                />
            )}
        </div>
    );
}
