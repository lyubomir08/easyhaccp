import { useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";

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
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const onObjectChange = (index, field, value) => {
        const objects = [...form.objects];
        objects[index][field] = value;
        setForm((state) => ({ ...state, objects }));
    };

    const addObject = () => {
        setForm((state) => ({
            ...state,
            objects: [...state.objects, { ...EMPTY_OBJECT }],
        }));
    };

    const removeObject = (index) => {
        setForm((state) => ({
            ...state,
            objects: state.objects.filter((_, i) => i !== index),
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const result = await register(form);
            setSuccess(result.message);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl mb-4">Регистрация на фирма</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">

                {/* ФИРМА */}
                <input name="bulstat" placeholder="Булстат" onChange={onChange} required />
                <input name="companyName" placeholder="Име на фирмата" onChange={onChange} required />

                {/* СОБСТВЕНИК */}
                <input name="ownerFirstName" placeholder="Име на собственик" onChange={onChange} />
                <input name="ownerLastName" placeholder="Фамилия на собственик" onChange={onChange} />

                {/* КОНТАКТИ */}
                <input name="phone" placeholder="Телефон" onChange={onChange} />
                <input name="email" type="email" placeholder="Email" onChange={onChange} />

                {/* OWNER ACCOUNT */}
                <input name="username" placeholder="Потребителско име (Owner)" onChange={onChange} required />
                <input name="password" type="password" placeholder="Парола" onChange={onChange} required />

                {/* ОБЕКТИ */}
                <h2 className="text-xl mt-4">Обекти</h2>

                {form.objects.map((obj, index) => (
                    <div key={index} className="border p-4 rounded flex flex-col gap-2">

                        <input
                            placeholder="Име на обекта"
                            value={obj.name}
                            onChange={(e) => onObjectChange(index, "name", e.target.value)}
                            required
                        />

                        <input
                            placeholder="Адрес"
                            value={obj.address}
                            onChange={(e) => onObjectChange(index, "address", e.target.value)}
                        />

                        <input
                            placeholder="Работно време"
                            value={obj.workingHours}
                            onChange={(e) => onObjectChange(index, "workingHours", e.target.value)}
                        />

                        <select
                            value={obj.type}
                            onChange={(e) => onObjectChange(index, "type", e.target.value)}
                            required
                        >
                            <option value="">Тип на обекта</option>
                            <option value="retail">Търговия на дребно</option>
                            <option value="wholesale">Търговия на едро</option>
                            <option value="restaurant">Заведение за обществено хранене</option>
                            <option value="catering">Кетъринг</option>
                        </select>

                        {/* MANAGER / MOL */}
                        <input
                            placeholder="MOL потребителско име"
                            value={obj.molUsername}
                            onChange={(e) => onObjectChange(index, "molUsername", e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="MOL парола"
                            value={obj.molPassword}
                            onChange={(e) => onObjectChange(index, "molPassword", e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="MOL email"
                            value={obj.molEmail}
                            onChange={(e) => onObjectChange(index, "molEmail", e.target.value)}
                        />

                        {form.objects.length > 1 && (
                            <button type="button" onClick={() => removeObject(index)}>
                                Премахни обект
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addObject}>
                    ➕ Добави още обект
                </button>

                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}

                <button disabled={loading}>
                    {loading ? "Изпращане..." : "Изпрати заявка"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Вече имаш профил? <Link to="/login">Вход</Link>
            </p>
        </div>
    );
}
