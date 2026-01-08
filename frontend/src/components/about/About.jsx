export default function About() {
    return (
        <section className="h-[calc(100vh-75px)] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center">
            <div className="max-w-4xl mx-auto px-6 text-center text-white">

                <h1 className="text-4xl font-bold mb-6">
                    За <span className="text-blue-500">EasyHACCP</span>
                </h1>

                <p className="text-lg text-slate-250 leading-relaxed mb-10">
                    EasyHACCP е професионална платформа за изготвяне,
                    внедряване и управление на цялостни HACCP системи,
                    съобразени с реалните нужди на хранителния бизнес.
                </p>

                <div className="border-l-4 border-blue-500 pl-6 inline-block text-left">
                    <p className="text-xl font-semibold">
                        Десислава Томова
                    </p>
                    <p className="text-slate-300">
                        Технолог по безопасност на храните
                    </p>
                </div>

                <div className="mt-10 text-slate-250">
                    <p>Телефон: —</p>
                    <p>Email: —</p>
                </div>
            </div>
        </section>
    );
}
