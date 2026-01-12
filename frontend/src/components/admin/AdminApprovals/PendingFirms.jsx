import { useEffect, useState } from "react";
import {
    getInactiveFirms,
    activateFirm,
} from "../../../services/adminService";

export default function PendingFirms() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFirms();
    }, []);

    const loadFirms = async () => {
        setLoading(true);
        try {
            const data = await getInactiveFirms();
            setFirms(data);
        } catch (err) {
            console.error("Error loading firms", err);
        } finally {
            setLoading(false);
        }
    };

    const onActivate = async (firmId) => {
        if (!confirm("Сигурен ли си, че искаш да одобриш фирмата?")) return;

        try {
            await activateFirm(firmId);
            setFirms((state) => state.filter(f => f._id !== firmId));
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при одобряване");
        }
    };

    return (
        <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Фирми за одобрение
            </h2>

            {loading && <p className="text-slate-500">Зареждане...</p>}

            {!loading && firms.length === 0 && (
                <p className="text-slate-500">Няма фирми за одобрение</p>
            )}

            <div className="space-y-3">
                {firms.map((firm) => (
                    <div
                        key={firm._id}
                        className="w-full bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-slate-900">
                                {firm.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                Булстат: {firm.bulstat}
                            </p>
                        </div>

                        <button
                            onClick={() => onActivate(firm._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                        >
                            Одобри
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
