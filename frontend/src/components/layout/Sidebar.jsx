import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

export default function Sidebar() {
    const { role } = useUser();

    const link =
        "block px-4 py-2 rounded hover:bg-slate-200 transition";

    return (
        <aside className="w-64 bg-white border-r p-4">
            <div className="text-xl font-bold mb-6 text-blue-700">
                EasyHACCP
            </div>

            <nav className="flex flex-col gap-2 text-slate-700">

                {role === "admin" && (
                    <>
                        <NavLink to="/dashboard/admin" className={link}>
                            Одобрения
                        </NavLink>

                        <NavLink to="/admin/settings" className={link}>
                            Настройки
                        </NavLink>
                    </>
                )}

                {(role === "owner" || role === "manager") && (
                    <>
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
                    </>
                )}
            </nav>
        </aside>
    );
}
