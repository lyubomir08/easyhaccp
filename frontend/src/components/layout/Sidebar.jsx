import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

const link =
    "block px-4 py-2 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition";

const activeLink =
    "bg-blue-100 text-blue-700 font-semibold";

const section =
    "px-4 mt-6 mb-2 text-xs uppercase tracking-wide text-slate-400";

export default function Sidebar() {
    const { role } = useUser();

    return (
        <aside className="w-76 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-200">
                <div className="text-lg font-bold text-slate-900">
                    Easy<span className="text-blue-600">HACCP</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 capitalize">
                    {role} panel
                </div>
            </div>

            <nav className="py-4">
                {role === "admin" && (
                    <>
                        <div className={section}>Администрация</div>

                        <NavLink
                            to="/admin/approvals"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Одобрения
                        </NavLink>
                        <NavLink
                            to="/admin/firms"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Фирми
                        </NavLink>
                        <NavLink
                            to="/admin/objects"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Обекти
                        </NavLink>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Потребители
                        </NavLink>
                    </>
                )}

                {role === "owner" && (
                    <>
                        <div className={section}>Моята фирма</div>

                        <NavLink
                            to="/myFirm"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Профил на фирмата
                        </NavLink>
                        <NavLink
                            to="/myObjects"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Моите обекти
                        </NavLink>
                    </>
                )}

                {role === "manager" && (
                    <>
                        <div className={section}>Моят обект</div>

                        <NavLink
                            to="/object"
                            className={({ isActive }) =>
                                `${link} ${isActive ? activeLink : ""}`
                            }
                        >
                            Данни за обекта
                        </NavLink>
                    </>
                )}

                <div className={section}>Добавяне</div>
                <NavLink to="/employees" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Служители
                </NavLink>
                <NavLink to="/foods" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Групи храни
                </NavLink>
                <NavLink to="/recipes" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Рецепти
                </NavLink>
                <NavLink to="/suppliers" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Доставчици
                </NavLink>
                <NavLink to="/fridges" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Хладилници
                </NavLink>
                <NavLink to="/fryers" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Фритюрници
                </NavLink>
                <NavLink to="/rooms" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Помещения
                </NavLink>
                <NavLink to="/disinfectants" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Дезинфекция
                </NavLink>
                <NavLink to="/partners" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Фирми получатели
                </NavLink>

                <div className={section}>Дневници</div>
                <NavLink to="/diaries/foods" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Храни и опаковки
                </NavLink>
                <NavLink to="/diaries/hygiene" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Хигиена на обекта
                </NavLink>
                <NavLink to="/diaries/personal" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Лична хигиена на персонала
                </NavLink>
                <NavLink to="/diaries/temperatures" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Температури
                </NavLink>
                <NavLink to="/diaries/oil" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Смяна на мазнина
                </NavLink>
                <NavLink to="/diaries/cooking" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Температура на храните при готвене
                </NavLink>
                <NavLink to="/diaries/production" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Произведени храни
                </NavLink>
                <NavLink to="/diaries/expedition" className={({ isActive }) =>
                    `${link} ${isActive ? activeLink : ""}`
                }>
                    Експедиция на храни
                </NavLink>
            </nav>
        </aside>
    );
}
