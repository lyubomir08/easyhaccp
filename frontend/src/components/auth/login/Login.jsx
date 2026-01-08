import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useUser from "../../../hooks/useUser";

export default function Login() {
    const { login } = useUser();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm(state => ({ ...state, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(form.username, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Грешни данни");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border">

                <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
                    Вход
                </h1>

                <p className="text-center text-slate-500 mb-6">
                    Влез в системата EasyHACCP
                </p>

                <form onSubmit={onSubmit} className="space-y-4">

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

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Моля изчакайте..." : "Вход"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Нямаш профил?{" "}
                    <Link to="/sign-up" className="text-blue-700 font-semibold hover:underline">
                        Регистрация
                    </Link>
                </p>

            </div>
        </div>
    );
}
