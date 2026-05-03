import { useState } from "react";
import { changePassword } from "../../services/userService";
import useUser from "../../hooks/useUser";

export default function UserProfile() {
    const { user } = useUser();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loadingPass, setLoadingPass] = useState(false);

    const onPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoadingPass(true);

        try {
            await changePassword(oldPassword, newPassword);
            alert("Паролата е сменена успешно");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при смяна на парола");
        } finally {
            setLoadingPass(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-72px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full">

                {/* PROFILE INFO */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                    <h2 className="text-lg font-semibold mb-6">Профил</h2>

                    <div className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium mb-1">Име</label>
                            <input
                                value={user.name || "—"}
                                disabled
                                className="w-full rounded-md border px-4 py-2.5 bg-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Потребител</label>
                            <input
                                value={user.username}
                                disabled
                                className="w-full rounded-md border px-4 py-2.5 bg-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Имейл</label>
                            <input
                                value={user.email || "—"}
                                disabled
                                className="w-full rounded-md border px-4 py-2.5 bg-slate-100"
                            />
                        </div>

                    </div>
                </section>

                {/* CHANGE PASSWORD */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                    <h2 className="text-lg font-semibold mb-6">Смяна на парола</h2>

                    <form onSubmit={onPasswordSubmit} className="space-y-5">
                        <input
                            type="password"
                            placeholder="Стара парола"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full border px-4 py-2.5 rounded-md"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Нова парола"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border px-4 py-2.5 rounded-md"
                            required
                        />

                        <button
                            disabled={loadingPass}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700"
                        >
                            {loadingPass ? "Запис..." : "Смени парола"}
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
}