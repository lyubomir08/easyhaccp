import { useEffect, useState } from "react";
import * as adminService from "../../services/adminService";

export default function AdminPanel() {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        adminService
            .getInactiveUsers()
            .then(setGroups)
            .catch(() => setError("Грешка при зареждане"));
    }, []);

    const onActivate = async (userId) => {
        await adminService.activateUser(userId);
        setGroups(groups =>
            groups
                .map(g => ({
                    ...g,
                    users: g.users.filter(u => u._id !== userId),
                }))
                .filter(g => g.users.length > 0)
        );
    };

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold">Админ панел</h1>

            {groups.length === 0 && (
                <p>Няма чакащи фирми 🎉</p>
            )}

            {groups.map(group => (
                <div
                    key={group.firm._id}
                    className="bg-white border rounded-xl p-5"
                >
                    <h2 className="text-lg font-semibold mb-4">
                        🏢 {group.firm.name}
                    </h2>

                    {group.users.map(user => (
                        <div
                            key={user._id}
                            className="flex justify-between items-center border-t py-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {user.username}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {user.role}
                                </p>
                            </div>

                            <button
                                onClick={() => onActivate(user._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Активирай
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
