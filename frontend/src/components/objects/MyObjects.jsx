import { useEffect, useState } from "react";
import { getObjects, deleteObject } from "../../services/objectService";
import EditObjectModal from "./EditObjectModal";

export default function MyObjects() {
    const [objects, setObjects] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        const data = await getObjects();
        setObjects(data);
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        await deleteObject(id);
        setObjects(s => s.filter(o => o._id !== id));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Моите обекти</h1>
            </div>

            {objects.map(obj => (
                <div
                    key={obj._id}
                    className="bg-white border rounded-lg p-4 flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{obj.name}</p>
                        <p className="text-sm text-slate-500">{obj.address}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditingId(obj._id)}
                            className="px-4 py-2 bg-slate-700 text-white rounded"
                        >
                            Редакция
                        </button>

                        <button
                            onClick={() => onDelete(obj._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Изтрий
                        </button>
                    </div>
                </div>
            ))}

            {editingId && (
                <EditObjectModal
                    objectId={editingId}
                    onClose={() => setEditingId(null)}
                    onUpdated={loadObjects}
                />
            )}
        </div>
    );
}
