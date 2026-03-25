import { useState } from "react";
import { Link, NavLink } from "react-router";
import useUser from "../../hooks/useUser";

const baseLink = "text-slate-100 hover:text-white transition text-sm";

export default function Header() {
    const { user, logout } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-black border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold text-white tracking-wide">
                    Easy<span className="text-blue-500">HACCP</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-7">
                    <NavLink to="/" className={baseLink}>Начало</NavLink>
                    <NavLink to="/about" className={baseLink}>За нас</NavLink>
                    {!user && (
                        <>
                            <NavLink to="/sign-in" className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 hover:border-white hover:text-white transition text-sm">
                                Вход
                            </NavLink>
                            <NavLink to="/sign-up" className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-slate-200 transition text-sm">
                                Регистрация
                            </NavLink>
                        </>
                    )}
                    {user && (
                        <>
                            <NavLink to="/dashboard" className={baseLink}>Табло</NavLink>
                            <button onClick={logout} className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 hover:border-white hover:text-white transition text-sm">
                                Изход
                            </button>
                            <NavLink to="/profile" className={baseLink}>Профил</NavLink>
                        </>
                    )}
                </nav>

                {/* Мобилен хамбургер */}
                <button
                    className="md:hidden text-slate-200 hover:text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Мобилно меню */}
            {menuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 flex flex-col gap-3">
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className={baseLink}>Начало</NavLink>
                    <NavLink to="/about" onClick={() => setMenuOpen(false)} className={baseLink}>За нас</NavLink>
                    {!user && (
                        <>
                            <NavLink to="/sign-in" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 text-sm text-center">
                                Вход
                            </NavLink>
                            <NavLink to="/sign-up" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md bg-white text-black font-medium text-sm text-center">
                                Регистрация
                            </NavLink>
                        </>
                    )}
                    {user && (
                        <>
                            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={baseLink}>Табло</NavLink>
                            <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={baseLink}>Профил</NavLink>
                            <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-2 rounded-md border border-slate-600 text-slate-200 text-sm text-left">
                                Изход
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}