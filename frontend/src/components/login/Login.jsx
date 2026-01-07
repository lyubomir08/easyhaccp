import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useUser from "../../hooks/useUser";

export default function Login() {
    const { login } = useUser();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(form.username, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl mb-4">Вход</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input
                    name="username"
                    placeholder="Потребителско име"
                    value={form.username}
                    onChange={onChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Парола"
                    value={form.password}
                    onChange={onChange}
                    required
                />

                {error && <p className="text-red-600">{error}</p>}

                <button disabled={loading}>
                    {loading ? "Моля изчакайте..." : "Вход"}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Нямаш профил? <Link to="/register">Регистрация</Link>
            </p>
        </div>
    );
}
