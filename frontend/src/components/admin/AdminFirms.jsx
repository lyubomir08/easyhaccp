import { useEffect, useState } from "react";
import {
    getAllFirms,
    deleteFirm,
} from "../../services/firmService";
import EditFirmModal from "../../components/admin/EditFirmModal";

export default function AdminFirms() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFirm, setEditingFirm] = useState(null);

    useEffect(() => {
        loadFirms();
    }, []);

    const loadFirms = async () => {
        setLoading(true);
        try {
            const data = await getAllFirms();
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
            setFirms(state => state.filter(f => f._id !== firmId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">
                Администратор – Фирми
            </h1>

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && firms.length === 0 && (
                <p className="text-slate-500">Няма фирми</p>
            )}

            <div className="space-y-3">
                {firms.map(firm => (
                    <div
                        key={firm._id}
                        className="bg-white border rounded-lg p-4 flex justify-between items-center"
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

                        <div className="flex gap-3">
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
                    onUpdated={loadFirms}
                />
            )}
        </div>
    );
}
