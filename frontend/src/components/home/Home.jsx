import { Link } from "react-router";
import logo from "../../assets/logo.png";

export default function Home() {
    return (
        <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full">

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                            Професионално управление на
                            <span className="block text-blue-500">HACCP системи</span>
                        </h1>

                        <p className="text-slate-300 text-lg mb-10 max-w-xl">
                            EasyHACCP е цялостна платформа за внедряване,
                            поддържане и контрол на HACCP изисквания
                            в хранителни обекти.
                        </p>

                        <div className="flex gap-4">
                            <Link
                                to="/sign-up"
                                className="px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-slate-200 transition"
                            >
                                Регистрация
                            </Link>

                            <Link
                                to="/about"
                                className="px-6 py-3 rounded-md border border-slate-500 text-slate-200 hover:border-white hover:text-white transition"
                            >
                                За нас
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <div className="bg-white rounded-2xl p-10 shadow-2xl">
                            <img
                                src={logo}
                                alt="EasyHACCP"
                                className="h-48 md:h-56 w-auto"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
