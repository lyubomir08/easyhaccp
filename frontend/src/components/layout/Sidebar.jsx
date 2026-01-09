import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

export default function Sidebar() {
    const { role } = useUser();

    const base =
        "px-4 py-2 rounded-md transition text-slate-700 hover:bg-slate-100";

    const active =
        "bg-blue-50 text-blue-600 font-medium";

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">

            <div className="px-6 py-6 border-b border-slate-200 text-xl font-semibold">
                Easy<span className="text-blue-500">HACCP</span>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-1">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : ""}`
                    }
                >
                    Табло
                </NavLink>

                <NavLink
                    to="/objects"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : ""}`
                    }
                >
                    Обекти
                </NavLink>

                <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : ""}`
                    }
                >
                    Служители
                </NavLink>

                <NavLink
                    to="/diaries"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : ""}`
                    }
                >
                    Дневници
                </NavLink>

                {isAdmin && (
                    <>
                        <NavLink to="/admin">Admin Panel</NavLink>
                        {/* <NavLink to="/admin/firms">Фирми</NavLink> */}
                    </>
                )}
            </nav>
        </aside>
    );
}
