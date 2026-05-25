import { NavLink } from "react-router";
import useUser from "../../hooks/useUser";

const link = "block px-4 py-2 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition";
const activeLink = "bg-blue-100 text-blue-700 font-semibold";
const section = "px-4 mt-6 mb-2 text-xs uppercase tracking-wide text-slate-400";

export default function Sidebar({ onClose }) {
    const { role, objectTypes, logout } = useUser();

    const isRetail = objectTypes.includes("retail");
    const isWholesale = objectTypes.includes("wholesale");
    const isRestaurant = objectTypes.includes("restaurant");
    const isCatering = objectTypes.includes("catering");

    const handleClick = () => { if (onClose) onClose(); };

    const NL = ({ to, children }) => (
        <NavLink to={to} onClick={handleClick} className={({ isActive }) => `${link} ${isActive ? activeLink : ""}`}>
            {children}
        </NavLink>
    );

    return (
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto h-full flex flex-col">
            {/* On mobile overlay (onClose provided) add top padding so content clears the fixed header */}
            <div className={`px-6 py-5 border-b border-slate-200 flex justify-between items-center ${onClose ? "mt-[72px]" : ""}`}>
                <div>
                    <div className="text-lg font-bold text-slate-900">Easy<span className="text-blue-600">HACCP</span></div>
                    <div className="text-xs text-slate-500 mt-1">
                        {role === "admin" ? "Администратор" : role === "owner" ? "Собственик" : "Мениджър"} панел
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="py-4 flex-1 overflow-y-auto">
                {role === "admin" && (
                    <>
                        <div className={section}>Администрация</div>
                        <NL to="/admin/approvals">Одобрения</NL>
                        <NL to="/admin/firms">Фирми</NL>
                        <NL to="/admin/objects">Обекти</NL>
                        <NL to="/admin/users">Потребители</NL>
                    </>
                )}

                {role === "owner" && (
                    <>
                        <div className={section}>Моята фирма</div>
                        <NL to="/myFirm">Профил на фирмата</NL>
                        <NL to="/myObjects">Моите обекти</NL>
                    </>
                )}

                {role === "manager" && (
                    <>
                        <div className={section}>Моят обект</div>
                        <NL to="/myObject">Данни за обекта</NL>
                    </>
                )}

                <div className={section}>Добавяне</div>
                <NL to="/employees">Служители</NL>

                {(isCatering || isRestaurant) && <NL to="/foods">Групи храни</NL>}

                {(isCatering || isRestaurant) && <NL to="/recipes">Рецепти</NL>}

                <NL to="/suppliers">Доставчици</NL>
                <NL to="/fridges">Хладилници</NL>

                {(isCatering || isRestaurant) && <NL to="/fryers">Фритюрници</NL>}

                <NL to="/rooms">Помещения</NL>
                <NL to="/disinfectants">Дезинфекция</NL>

                {(isWholesale || isCatering) && <NL to="/partners">Фирми получатели</NL>}

                <div className={section}>Дневници</div>

                <NL to="/diaries/foods">Храни и опаковки</NL>

                <NL to="/diaries/hygiene">Хигиена на обекта</NL>

                <NL to="/diaries/personal">Лична хигиена на персонала</NL>

                <NL to="/diaries/temperatures">Температури</NL>

                <NL to="/diaries/trainingdiary">Обучения на служители</NL>
                {(isCatering || isRestaurant) && <NL to="/diaries/oil">Смяна на мазнина</NL>}

                {(isCatering) && <NL to="/diaries/cooking">Температура на храните при готвене</NL>}

                {(isCatering) && <NL to="/diaries/production">Произведени храни</NL>}

                {(isWholesale || isCatering) && <NL to="/diaries/expedition">Експедиция на храни</NL>}
            </nav>

            <div className="border-t border-slate-200 px-4 py-4 flex flex-col gap-1">
                <NL to="/profile">Профил</NL>
                <button
                    onClick={() => { logout(); if (onClose) onClose(); }}
                    className="block w-full text-left px-4 py-2 rounded-md text-slate-700 hover:bg-red-50 hover:text-red-600 transition text-sm"
                >
                    Изход
                </button>
            </div>
        </aside>
    );
}