export default function About() {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-slate-900 mb-6">
                    За нас
                </h1>

                <div className="space-y-6 text-slate-700 leading-relaxed text-lg">

                    <p>
                        Фирма <strong>EasyHACCP</strong> е специализирана в изготвяне,
                        внедряване и управление на цялостни системи за безопасност на храните
                        (HACCP) в хранителни обекти.
                    </p>

                    <p>
                        Работим с ресторанти, търговски обекти, кетъринг фирми и производители,
                        като осигуряваме пълно съответствие с нормативните изисквания.
                    </p>

                    <div className="border-t pt-6">
                        <p className="font-semibold text-slate-900">
                            Десислава Томова – технолог
                        </p>
                        <p>Телефон: …</p>
                        <p>Email: …</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
