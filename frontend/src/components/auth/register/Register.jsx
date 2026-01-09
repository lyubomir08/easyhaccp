import { useState } from "react";
import { Link } from "react-router";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const onChange = (e) => {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onObjectChange = (index, field, value) => {
        const objects = [...form.objects];
        objects[index][field] = value;
        setForm(state => ({ ...state, objects }));
    };

    const addObject = () => {
        setForm(state => ({
            ...state,
            objects: [...state.objects, { ...EMPTY_OBJECT }],
        }));
    };

    const removeObject = (index) => {
        setForm(state => ({
            ...state,
            objects: state.objects.filter((_, i) => i !== index),
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await register(form);
            setSuccess(result.message);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при регистрация");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Регистрация на фирма
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Създаване на HACCP профил
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-blue-900">
                        Данни за фирмата
                    </h2>

                    <input
                        name="companyName"
                        placeholder="Име на фирмата"
                        value={form.companyName}
                        onChange={onChange}
                        className="input"
                        required
                    />

                    <input
                        name="bulstat"
                        placeholder="Булстат"
                        value={form.bulstat}
                        onChange={onChange}
                        className="input"
                        required
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-blue-900">
                        Собственик
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="ownerFirstName"
                            placeholder="Име"
                            value={form.ownerFirstName}
                            onChange={onChange}
                            className="input"
                            required
                        />

                        <input
                            name="ownerLastName"
                            placeholder="Фамилия"
                            value={form.ownerLastName}
                            onChange={onChange}
                            className="input"
                            required
                        />
                    </div>

                    <input
                        name="phone"
                        placeholder="Телефон"
                        value={form.phone}
                        onChange={onChange}
                        className="input"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={onChange}
                        className="input"
                        required
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-blue-900">
                        Профил за вход
                    </h2>

                    <input
                        name="username"
                        placeholder="Потребителско име"
                        value={form.username}
                        onChange={onChange}
                        className="input"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Парола"
                        value={form.password}
                        onChange={onChange}
                        className="input"
                        required
                    />
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-semibold text-blue-900">
                        Обекти
                    </h2>

                    {form.objects.map((obj, index) => (
                        <div
                            key={index}
                            className="border rounded-xl p-6 space-y-4 bg-slate-50"
                        >
                            <h3 className="font-semibold text-slate-800">
                                Обект {index + 1}
                            </h3>

                            <input
                                placeholder="Име на обекта"
                                value={obj.name}
                                onChange={e =>
                                    onObjectChange(index, "name", e.target.value)
                                }
                                className="input"
                                required
                            />

                            <input
                                placeholder="Адрес"
                                value={obj.address}
                                onChange={e =>
                                    onObjectChange(index, "address", e.target.value)
                                }
                                className="input"
                            />

                            <input
                                placeholder="Работно време"
                                value={obj.workingHours}
                                onChange={e =>
                                    onObjectChange(index, "workingHours", e.target.value)
                                }
                                className="input"
                            />

                            <select
                                value={obj.type}
                                onChange={e =>
                                    onObjectChange(index, "type", e.target.value)
                                }
                                className="input"
                                required
                            >
                                <option value="">Тип на обекта</option>
                                <option value="retail">Търговия на дребно</option>
                                <option value="wholesale">Търговия на едро</option>
                                <option value="restaurant">Заведение</option>
                                <option value="catering">Кетъринг</option>
                            </select>

                            <div className="border-t pt-4 space-y-2">
                                <p className="font-medium text-slate-700">
                                    Управител на обекта
                                </p>

                                <input
                                    placeholder="Потребителско име"
                                    value={obj.molUsername}
                                    onChange={e =>
                                        onObjectChange(index, "molUsername", e.target.value)
                                    }
                                    className="input"
                                />

                                <input
                                    type="password"
                                    placeholder="Парола"
                                    value={obj.molPassword}
                                    onChange={e =>
                                        onObjectChange(index, "molPassword", e.target.value)
                                    }
                                    className="input"
                                />

                                <input
                                    type="email"
                                    placeholder="Имейл"
                                    value={obj.molEmail}
                                    onChange={e =>
                                        onObjectChange(index, "molEmail", e.target.value)
                                    }
                                    className="input"
                                />
                            </div>

                            {form.objects.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeObject(index)}
                                    className="text-red-600 text-sm hover:underline"
                                >
                                    Премахни обект
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addObject}
                        className="text-blue-700 font-semibold hover:underline"
                    >
                        ➕ Добави още обект
                    </button>
                </section>

                {error && (
                    <p className="text-red-600 text-sm text-center">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-green-600 text-sm text-center">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
                >
                    {loading ? "Изпращане..." : "Създай профил"}
                </button>

                <p className="text-center text-slate-600 text-sm">
                    Вече имаш акаунт?{" "}
                    <Link to="/sign-in" className="text-blue-700 font-medium hover:underline">
                        Вход
                    </Link>
                </p>
            </form>
        </div>
    );
}
