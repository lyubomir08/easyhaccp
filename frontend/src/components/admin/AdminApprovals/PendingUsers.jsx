import { useEffect, useState } from "react";
import {
    getInactiveUsers,
    activateUser,
} from "../../../services/adminService";

export default function PendingUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getInactiveUsers();
            setUsers(data);
        } catch (err) {
            console.error("Error loading users", err);
        } finally {
            setLoading(false);
        }
    };

    const onActivate = async (userId) => {
        if (!confirm("Сигурен ли си, че искаш да одобриш потребителя?")) return;

        try {
            await activateUser(userId);
            setUsers((state) => state.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при одобряване");
        }
    };

    return (
        <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Потребители за одобрение
            </h2>

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && users.length === 0 && (
                <p className="text-slate-500">Няма потребители за одобрение</p>
            )}

            <div className="space-y-3">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="w-full bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-slate-900">
                                {user.username}
                            </p>
                            <p className="text-sm text-slate-600">
                                Роля: {user.role}
                            </p>
                            {user.firm_id?.name && (
                                <p className="text-sm text-slate-500">
                                    Фирма: {user.firm_id.name}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => onActivate(user._id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                        >
                            Одобри
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
