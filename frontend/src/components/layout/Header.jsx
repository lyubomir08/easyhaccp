import { Link } from "react-router";
import useUser from "../../hooks/useUser";

export default function Header() {
    const { user, logout } = useUser();

    return (
        <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-400">
                EasyHACCP
            </Link>

            <nav className="flex items-center gap-4">
                <Link to="/about" className="hover:text-blue-400">
                    За нас
                </Link>

                {!user && (
                    <>
                        <Link
                            to="/sign-in"
                            className="border border-blue-400 px-3 py-1 rounded hover:bg-blue-400 hover:text-black"
                        >
                            Вход
                        </Link>
                        <Link
                            to="/sign-up"
                            className="bg-blue-500 px-3 py-1 rounded text-black hover:bg-blue-400"
                        >
                            Регистрация
                        </Link>
                    </>
                )}

                {user && (
                    <button
                        onClick={logout}
                        className="border border-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-black"
                    >
                        Изход
                    </button>
                )}
            </nav>
        </header>
    );
}
