import { useEffect, useState } from "react";
import { getMyFirm } from "../../services/firmService";
import EditMyFirmModal from "./EditMyFirmModal";

export default function MyFirm() {
    const [firm, setFirm] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFirm();
    }, []);

    const loadFirm = async () => {
        setLoading(true);
        try {
            const data = await getMyFirm();
            setFirm(data);
        } catch {
            alert("Грешка при зареждане на фирмата");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-slate-500">Зареждане...</p>;
    }

    if (!firm) {
        return <p className="text-slate-500">Няма данни за фирма</p>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <h1 className="text-2xl font-bold text-black text-center">
                Моята фирма
            </h1>

            <div className="bg-white border rounded-2xl p-6 shadow-md">
                <div className="space-y-4">
                    <InfoRow label="Име на фирмата" value={firm.name} />
                    <InfoRow label="Булстат" value={firm.bulstat} />
                    <InfoRow label="МОЛ" value={firm.mol || "—"} />
                    <InfoRow label="Телефон" value={firm.phone || "—"} />
                    <InfoRow label="Имейл" value={firm.email || "—"} />
                    {/* <InfoRow
                        label="ДДС регистрация"
                        value={firm.vat_registered ? "Да" : "Не"}
                    /> */}
                </div>

                <div className="mt-6">
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
                <EditMyFirmModal
                    firm={firm}
                    onClose={() => setEditing(false)}
                    onUpdated={loadFirm}
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
