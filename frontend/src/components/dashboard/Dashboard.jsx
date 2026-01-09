import useUser from "../../hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                    Табло
                </h1>
                <p className="text-slate-500 mt-1">
                    Добре дошъл{user?.username ? `, ${user.username}` : ""} 👋
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Обекти"
                    value="—"
                    subtitle="Активни обекти"
                />

                <StatCard
                    title="Служители"
                    value="—"
                    subtitle="Назначени"
                />

                <StatCard
                    title="Дневници"
                    value="—"
                    subtitle="Активни"
                />

                <StatCard
                    title="Състояние"
                    value="OK"
                    subtitle="HACCP статус"
                    highlight
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-medium text-slate-700 mb-2">
                    Обобщение
                </h2>
                <p className="text-slate-500">
                    Тук ще се показва обобщена информация за
                    HACCP процесите, последни проверки и нотификации.
                </p>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, highlight }) {
    return (
        <div
            className={`
                rounded-xl p-5 border
                ${highlight
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-200"}
            `}
        >
            <p className="text-sm text-slate-500 mb-1">
                {title}
            </p>

            <p className="text-3xl font-semibold text-slate-800">
                {value}
            </p>

            <p className="text-sm text-slate-400 mt-2">
                {subtitle}
            </p>
        </div>
    );
}
