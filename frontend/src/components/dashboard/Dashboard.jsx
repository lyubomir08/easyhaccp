import { useEffect, useState } from "react";
import api from "../../services/api";
import useUser from "../../hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!user) return;
        api.get("/dashboard").then(res => setData(res.data)).catch(() => {});
    }, [user]);

    const alerts = data?.alerts || {};
    const expiredEmployees = alerts.employeesExpired || [];
    const expiringSoon = alerts.employeesExpiringSoon || [];
    const allAlerts = [...expiredEmployees, ...expiringSoon];

    const objectCount = data?.objects?.length ?? "—";
    const employeeCount = data?.objects
        ? null  // ще го покажем само ако го имаме
        : null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Табло</h1>
                <p className="text-slate-500 mt-1">
                    Добре дошъл{user?.username ? `, ${user.username}` : ""} 👋
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Обекти"
                    value={data ? objectCount : "—"}
                    subtitle="Активни обекти"
                />
                <StatCard
                    title="Служители"
                    value={data ? (data.totalEmployees ?? "—") : "—"}
                    subtitle="Назначени"
                />
                <StatCard
                    title="Дневници"
                    value={data ? (data.activeDiaries ?? "—") : "—"}
                    subtitle="Активни"
                />
                <StatCard
                    title="Състояние"
                    value={allAlerts.length > 0 ? "⚠️" : "OK"}
                    subtitle="HACCP статус"
                    highlight={allAlerts.length === 0}
                    warning={allAlerts.length > 0}
                />
            </div>

            {allAlerts.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                        ⚠️ Здравни книжки — изискват внимание
                    </h2>
                    <div className="space-y-3">
                        {expiredEmployees.map(emp => (
                            <AlertRow key={emp._id} emp={emp} expired={true} />
                        ))}
                        {expiringSoon.map(emp => (
                            <AlertRow key={emp._id} emp={emp} expired={false} />
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-medium text-slate-700 mb-2">Обобщение</h2>
                <p className="text-slate-500">
                    Тук ще се показва обобщена информация за HACCP процесите, последни проверки и нотификации.
                </p>
            </div>
        </div>
    );
}

function AlertRow({ emp, expired }) {
    const today = new Date();
    const expiry = new Date(emp.health_card_expiry);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return (
        <div className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm border ${
            expired ? "bg-red-50 border-red-200" : daysLeft <= 7 ? "bg-orange-50 border-orange-200" : "bg-yellow-50 border-yellow-200"
        }`}>
            <span className="font-semibold text-slate-800">
                {emp.first_name} {emp.last_name}
            </span>
            <span className={`font-medium ${expired ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-yellow-700"}`}>
                {expired
                    ? `Изтекла преди ${Math.abs(daysLeft)} дни`
                    : daysLeft === 0
                    ? "Изтича днес!"
                    : `Изтича след ${daysLeft} дни — ${expiry.toLocaleDateString("bg-BG")}`
                }
            </span>
        </div>
    );
}

function StatCard({ title, value, subtitle, highlight, warning }) {
    return (
        <div className={`rounded-xl p-5 border ${
            warning ? "bg-orange-50 border-orange-200" :
            highlight ? "bg-blue-50 border-blue-200" :
            "bg-white border-slate-200"
        }`}>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-semibold text-slate-800">{value}</p>
            <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
        </div>
    );
}