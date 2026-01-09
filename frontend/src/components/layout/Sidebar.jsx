import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

export default function Sidebar() {
    const { isAdmin } = useUser();

    const link =
        "block px-4 py-2 rounded text-slate-700 hover:bg-slate-200 transition";

    return (
        <aside className="w-64 bg-white border-r border-slate-200 p-4">
            <div className="text-xl font-bold mb-6 text-slate-800">
                Easy<span className="text-blue-600">HACCP</span>
            </div>

            <nav className="flex flex-col gap-1">
                <NavLink to="/dashboard" className={link}>
                    Табло   
                </NavLink>

                <NavLink to="/objects" className={link}>
                    Обекти
                </NavLink>

                <NavLink to="/employees" className={link}>
                    Служители
                </NavLink>

                <NavLink to="/diaries" className={link}>
                    Дневници
                </NavLink>

                {isAdmin && (
                    <NavLink to="/admin" className={link}>
                        Админ панел
                    </NavLink>
                )}
            </nav>
        </aside>
    );
}
