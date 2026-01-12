import { useEffect, useState } from "react";
import { getObjects, deleteObject } from "../../../services/objectService";
import EditObjectModal from "./EditObjectModal";

export default function AdminObjects() {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingObject, setEditingObject] = useState(null);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        setLoading(true);
        try {
            const data = await getObjects();
            setObjects(data);
        } catch {
            alert("Грешка при зареждане на обектите");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (objectId) => {
        if (!confirm("Сигурен ли си, че искаш да изтриеш обекта?")) return;

        try {
            await deleteObject(objectId);
            setObjects(state => state.filter(o => o._id !== objectId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">
                Администратор – Обекти
            </h1>

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && objects.length === 0 && (
                <p className="text-slate-500">Няма обекти</p>
            )}

            <div className="space-y-3">
                {objects.map(object => (
                    <div
                        key={object._id}
                        className="bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-black">
                                {object.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                Адрес: {object.address}
                            </p>
                            {object.firm_id?.name && (
                                <p className="text-sm text-slate-500">
                                    Фирма: {object.firm_id.name}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingObject(object)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-md"
                            >
                                Редактирай
                            </button>

                            <button
                                onClick={() => onDelete(object._id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                            >
                                Изтрий
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingObject && (
                <EditObjectModal
                    object={editingObject}
                    onClose={() => setEditingObject(null)}
                    onUpdated={loadObjects}
                />
            )}
        </div>
    );
}
