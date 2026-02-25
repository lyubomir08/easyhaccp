import { Link, NavLink } from "react-router";
import useUser from "../../hooks/useUser";

export default function Header() {
    const { user, logout } = useUser();

    const baseLink =
        "text-slate-100 hover:text-white transition text-m";

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-black border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link
                    to="/"
                    className="text-xl font-semibold text-white tracking-wide"
                >
                    Easy<span className="text-blue-500">HACCP</span>
                </Link>

                <nav className="flex items-center gap-7">

                    <NavLink to="/" className={baseLink}>
                        Начало
                    </NavLink>

                    <NavLink to="/about" className={baseLink}>
                        За нас
                    </NavLink>

                    {!user && (
                        <>
                            <NavLink
                                to="/sign-in"
                                className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 hover:border-white hover:text-white transition"
                            >
                                Вход
                            </NavLink>

                            <NavLink
                                to="/sign-up"
                                className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-slate-200 transition"
                            >
                                Регистрация
                            </NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            {/* <NavLink to="/dashboard" className={baseLink}>
                                Табло
                            </NavLink> */}

                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 hover:border-white hover:text-white transition"
                            >
                                Изход
                            </button>

                            <NavLink to="/profile" className={baseLink}>
                                Профил
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
