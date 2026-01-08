import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

export default function Sidebar() {
    const { role } = useUser();

    const link = "block px-4 py-2 rounded hover:bg-slate-800";

    return (
        <aside className="w-64 bg-slate-900 text-white p-4">
            <div className="text-xl font-bold mb-6">EasyHACCP</div>

            <nav className="flex flex-col gap-2">
                <NavLink to="/dashboard" className={link}>Табло</NavLink>
                <NavLink to="/objects" className={link}>Обекти</NavLink>
                <NavLink to="/employees" className={link}>Служители</NavLink>
                <NavLink to="/diaries" className={link}>Дневници</NavLink>

                {role === "admin" && (
                    <NavLink to="/admin/firms" className={link}>Фирми</NavLink>
                )}
            </nav>
        </aside>
    );
}
