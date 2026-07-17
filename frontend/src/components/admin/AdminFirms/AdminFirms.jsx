import { useEffect, useState } from "react";
import { getAllFirms, deleteFirm } from "../../../services/firmService";
import EditFirmModal from "./EditFirmModal";
import CreateObjectForFirmModal from "../CreateObjectForFirmModal";
import CreateUserForFirmModal from "../CreateUserForFirmModal";

export default function AdminFirms() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFirm, setEditingFirm] = useState(null);
    const [creatingObjectForFirm, setCreatingObjectForFirm] = useState(null);
    const [creatingUserForFirm, setCreatingUserForFirm] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        loadFirms(debouncedSearch);
    }, [debouncedSearch]);

    const loadFirms = async (searchTerm) => {
        setLoading(true);
        try {
            const data = await getAllFirms(searchTerm);
            setFirms(data);
        } catch (err) {
            alert("Грешка при зареждане на фирмите");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (firmId) => {
        if (!confirm("Сигурен ли си, че искаш да изтриеш фирмата?")) return;

        try {
            await deleteFirm(firmId);
            setFirms((state) => state.filter((f) => f._id !== firmId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">
                Администратор – Фирми
            </h1>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Търси по име, булстат, МОЛ, имейл или телефон..."
                className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && firms.length === 0 && (
                <p className="text-slate-500">
                    {debouncedSearch ? "Няма резултати" : "Няма фирми"}
                </p>
            )}

            <div className="space-y-3">
                {firms.map((firm) => (
                    <div
                        key={firm._id}
                        className="bg-white border rounded-lg p-4 flex justify-between items-center gap-4"
                    >
                        <div>
                            <p className="font-semibold text-slate-900">
                                {firm.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                Булстат: {firm.bulstat}
                            </p>
                            <p className="text-sm text-slate-500">
                                Активна: {firm.active ? "Да" : "Не"}
                            </p>
                        </div>

                        <div className="flex gap-3 flex-wrap justify-end">
                            <button
                                onClick={() => setCreatingObjectForFirm(firm)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                            >
                                Добави обект
                            </button>

                            <button
                                onClick={() => setCreatingUserForFirm(firm)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                Добави потребител
                            </button>

                            <button
                                onClick={() => setEditingFirm(firm)}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md"
                            >
                                Редактирай
                            </button>

                            <button
                                onClick={() => onDelete(firm._id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                            >
                                Изтрий
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingFirm && (
                <EditFirmModal
                    firm={editingFirm}
                    onClose={() => setEditingFirm(null)}
                    onUpdated={() => loadFirms(debouncedSearch)}
                />
            )}

            {creatingObjectForFirm && (
                <CreateObjectForFirmModal
                    firm={creatingObjectForFirm}
                    onClose={() => setCreatingObjectForFirm(null)}
                    onCreated={() => loadFirms(debouncedSearch)}
                />
            )}

            {creatingUserForFirm && (
                <CreateUserForFirmModal
                    firm={creatingUserForFirm}
                    onClose={() => setCreatingUserForFirm(null)}
                    onCreated={() => loadFirms(debouncedSearch)}
                />
            )}
        </div>
    );
}