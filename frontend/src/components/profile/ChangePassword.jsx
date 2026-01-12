import { useState } from "react";
import { changePassword } from "../../services/userService";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await changePassword(oldPassword, newPassword);
            alert("Паролата е сменена успешно");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert(err.response?.data?.message || "Грешка");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md bg-white p-6 rounded-lg border">
            <h1 className="text-xl font-bold mb-4">
                Смяна на парола
            </h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <input
                    type="password"
                    placeholder="Стара парола"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    type="password"
                    placeholder="Нова парола"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded
                               hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Запис..." : "Смени парола"}
                </button>
            </form>
        </div>
    );
}
