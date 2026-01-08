import { useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../../../hooks/useUser";

const EMPTY_OBJECT = {
    name: "",
    address: "",
    workingHours: "",
    type: "",
    molUsername: "",
    molPassword: "",
    molEmail: "",
};

export default function Register() {
    const { register } = useUser();

    const [form, setForm] = useState({
        bulstat: "",
        companyName: "",
        ownerFirstName: "",
        ownerLastName: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        objects: [{ ...EMPTY_OBJECT }],
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const updateObject = (i, field, value) => {
        const objects = [...form.objects];
        objects[i][field] = value;
        setForm({ ...form, objects });
    };

    const addObject = () =>
        setForm({ ...form, objects: [...form.objects, { ...EMPTY_OBJECT }] });

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const res = await register(form);
            setSuccess(res.message);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при регистрация");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-semibold mb-2">
                    Регистрация на фирма
                </h1>

                <p className="text-sm text-slate-600 mb-6">
                    Попълването на този формуляр НЕ създава автоматично профил.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* фирма */}
                    <input className="input" placeholder="Булстат" onChange={e => setForm({ ...form, bulstat: e.target.value })} />
                    <input className="input" placeholder="Име на фирмата" onChange={e => setForm({ ...form, companyName: e.target.value })} />

                    {/* owner */}
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input" placeholder="Име на собственик" onChange={e => setForm({ ...form, ownerFirstName: e.target.value })} />
                        <input className="input" placeholder="Фамилия" onChange={e => setForm({ ...form, ownerLastName: e.target.value })} />
                    </div>

                    <input className="input" placeholder="Телефон" onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <input className="input" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />

                    <input className="input" placeholder="Потребителско име (Owner)" onChange={e => setForm({ ...form, username: e.target.value })} />
                    <input type="password" className="input" placeholder="Парола" onChange={e => setForm({ ...form, password: e.target.value })} />

                    <h2 className="text-lg font-semibold mt-6">Обекти</h2>

                    {form.objects.map((o, i) => (
                        <div key={i} className="border rounded-lg p-4 grid gap-2">
                            <input className="input" placeholder="Име на обекта" onChange={e => updateObject(i, "name", e.target.value)} />
                            <input className="input" placeholder="Адрес" onChange={e => updateObject(i, "address", e.target.value)} />
                            <input className="input" placeholder="Работно време" onChange={e => updateObject(i, "workingHours", e.target.value)} />

                            <select className="input" onChange={e => updateObject(i, "type", e.target.value)}>
                                <option value="">Тип на обекта</option>
                                <option value="retail">Търговия на дребно</option>
                                <option value="wholesale">Търговия на едро</option>
                                <option value="restaurant">Заведение</option>
                                <option value="catering">Кетъринг</option>
                            </select>

                            <input className="input" placeholder="MOL потребителско име" onChange={e => updateObject(i, "molUsername", e.target.value)} />
                            <input type="password" className="input" placeholder="MOL парола" onChange={e => updateObject(i, "molPassword", e.target.value)} />
                            <input className="input" placeholder="MOL email" onChange={e => updateObject(i, "molEmail", e.target.value)} />
                        </div>
                    ))}

                    <button type="button" onClick={addObject} className="text-blue-600 text-sm self-start">
                        + Добави още обект
                    </button>

                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

                    <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Изпрати заявка
                    </button>
                </form>

                <p className="text-sm mt-4">
                    Вече имаш профил?{" "}
                    <Link to="/sign-in" className="text-blue-600">Вход</Link>
                </p>
            </div>
        </div>
    );
}
