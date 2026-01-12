import { useEffect, useState } from "react";
import { updateProfile, changePassword } from "../../services/userService";
import useUser from "../../hooks/useUser";

export default function UserProfile() {
    const { user, setUser } = useUser();

    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const onProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);

        try {
            const updatedUser = await updateProfile({ email });
            setUser((prev) => ({ ...prev, ...updatedUser }));
            alert("Профилът е обновен успешно");
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при запис");
        } finally {
            setLoadingProfile(false);
        }
    };

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

                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                    <h2 className="text-lg font-semibold mb-6">
                        Профил
                    </h2>

                    <form onSubmit={onProfileSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Потребител
                            </label>
                            <input
                                value={user.username}
                                disabled
                                className="
                                w-full rounded-md border border-slate-300
                                px-4 py-2.5 text-sm bg-slate-100
                            "
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Имейл
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="
                                w-full rounded-md border border-slate-300
                                px-4 py-2.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                                required
                            />
                        </div>

                        <button
                            disabled={loadingProfile}
                            className="
                            inline-flex items-center justify-center
                            rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white
                            hover:bg-blue-700 transition
                            disabled:opacity-50
                        "
                        >
                            {loadingProfile ? "Запис..." : "Запази профил"}
                        </button>
                    </form>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                    <h2 className="text-lg font-semibold mb-6">
                        Смяна на парола
                    </h2>

                    <form onSubmit={onPasswordSubmit} className="space-y-5">
                        <input
                            type="password"
                            placeholder="Стара парола"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="
                            w-full rounded-md border border-slate-300
                            px-4 py-2.5 text-sm
                        "
                            required
                        />

                        <input
                            type="password"
                            placeholder="Нова парола"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="
                            w-full rounded-md border border-slate-300
                            px-4 py-2.5 text-sm
                        "
                            required
                        />

                        <button
                            disabled={loadingPass}
                            className="
                            inline-flex items-center justify-center
                            rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white
                            hover:bg-blue-700 transition
                            disabled:opacity-50
                        "
                        >
                            {loadingPass ? "Запис..." : "Смени парола"}
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
}
