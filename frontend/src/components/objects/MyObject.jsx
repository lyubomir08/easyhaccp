import { useEffect, useState } from "react";
import { getMyObject } from "../../services/objectService";
import EditMyObjectModal from "./EditMyObjectModal";

const OBJECT_TYPE_LABELS = {
    retail: "Търговия на дребно",
    wholesale: "Търговия на едро",
    restaurant: "Заведение",
    catering: "Кетъринг",
};

export default function MyObject() {
    const [object, setObject] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadObject();
    }, []);

    const loadObject = async () => {
        setLoading(true);
        try {
            const data = await getMyObject();
            setObject(data);
        } catch {
            alert("Грешка при зареждане на обекта");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-slate-500">Зареждане...</p>;
    if (!object) return <p className="text-slate-500">Няма обект</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <h1 className="text-2xl font-bold text-black text-center">
                Моят обект
            </h1>

            <div className="bg-white border rounded-2xl p-6 shadow-md space-y-4">
                <InfoRow label="Име на обекта" value={object.name} />
                <InfoRow label="Адрес" value={object.address || "—"} />
                <InfoRow label="Работно време" value={object.working_hours || "—"} />
                <InfoRow label="Тип" value={OBJECT_TYPE_LABELS[object.object_type] || "—"} />
                <InfoRow label="Фирма" value={object.firm_id?.name || "—"} />

                <div className="pt-4">
                    <button
                        onClick={() => setEditing(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-md
                                   hover:bg-blue-700 transition"
                    >
                        Редакция
                    </button>
                </div>
            </div>

            {editing && (
                <EditMyObjectModal
                    object={object}
                    onClose={() => setEditing(false)}
                    onUpdated={loadObject}
                />
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-slate-500">
                {label}
            </div>
            <div className="col-span-2 text-black">
                {value}
            </div>
        </div>
    );
}
