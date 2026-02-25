import { useEffect, useState } from "react";
import api from "../../services/api";
import EditFoodGroupModal from "./EditFoodGroupModal";

export default function FoodGroups() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    const [foodGroups, setFoodGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);

    const [form, setForm] = useState({
        food_name: "",
        cooking_temp: "",
        shelf_life: "",
    });

    const [editingGroup, setEditingGroup] = useState(null);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        try {
            const res = await api.get("/objects");
            setObjects(res.data);
            if (res.data.length === 1) {
                setSelectedObjectId(res.data[0]._id);
            }
        } catch {
            setError("Грешка при зареждане на обекти");
        }
    };

    useEffect(() => {
        if (!selectedObjectId) {
            setFoodGroups([]);
            return;
        }
        loadFoodGroups();
    }, [selectedObjectId]);

    const loadFoodGroups = async () => {
        try {
            setLoading(true);
            setError("");
            setSearch("");
            setVisibleCount(10);
            const res = await api.get(`/food-groups/${selectedObjectId}`);
            setFoodGroups(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при зареждане на групите");
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]: name === "cooking_temp" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedObjectId) {
            setError("Избери обект");
            return;
        }

        try {
            await api.post(`/food-groups/${selectedObjectId}`, {
                food_name: form.food_name.trim(),
                cooking_temp: form.cooking_temp === "" ? undefined : form.cooking_temp,
                shelf_life: form.shelf_life.trim(),
            });

            setForm({ food_name: "", cooking_temp: "", shelf_life: "" });
            loadFoodGroups();
        } catch (err) {
            setError(err.response?.data?.message || "Нямаш права за добавяне");
        }
    };

    const onDelete = async (groupId) => {
        if (!confirm("Сигурен ли си?")) return;
        try {
            await api.delete(`/food-groups/delete/${groupId}`);
            loadFoodGroups();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    const filteredFoodGroups = foodGroups.filter((g) =>
        g.food_name.toLowerCase().includes(search.toLowerCase())
    );

    const visibleFoodGroups = filteredFoodGroups.slice(0, visibleCount);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Групи храни</h1>

            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm mb-1">Обект</label>
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map((o) => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Добавяне на група</h2>

                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            name="food_name"
                            value={form.food_name}
                            onChange={onChange}
                            placeholder="Вид храна"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            type="number"
                            name="cooking_temp"
                            value={form.cooking_temp}
                            onChange={onChange}
                            placeholder="Температура °C"
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            name="shelf_life"
                            value={form.shelf_life}
                            onChange={onChange}
                            placeholder="Срок на годност"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <button className="bg-blue-600 text-white rounded-md px-4 py-2 md:col-span-3">
                            Добави
                        </button>
                    </form>

                    {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                </section>
            )}

            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Търси по вид храна..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setVisibleCount(10); }}
                        className="border rounded-md px-3 py-2 w-full"
                    />

                    {loading ? (
                        <p>Зареждане...</p>
                    ) : filteredFoodGroups.length === 0 ? (
                        <p className="text-slate-500">Няма резултати</p>
                    ) : (
                        <>
                            <ul className="space-y-2">
                                {visibleFoodGroups.map((g) => (
                                    <li key={g._id} className="border p-3 rounded-md flex justify-between items-center">
                                        <div>
                                            <strong>{g.food_name}</strong>
                                            {g.cooking_temp !== undefined && ` | ${g.cooking_temp}°C`}
                                            {g.shelf_life && ` | Срок: ${g.shelf_life}`}
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setEditingGroup(g)} className="text-blue-600 text-sm">
                                                Редактирай
                                            </button>
                                            <button onClick={() => onDelete(g._id)} className="text-red-600 text-sm">
                                                Изтрий
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {filteredFoodGroups.length > visibleCount && (
                                <div className="text-center pt-4">
                                    <button
                                        onClick={() => setVisibleCount((c) => c + 10)}
                                        className="border rounded-md px-4 py-2 hover:bg-slate-100"
                                    >
                                        Покажи още
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {editingGroup && (
                <EditFoodGroupModal
                    group={editingGroup}
                    onClose={() => setEditingGroup(null)}
                    onUpdated={loadFoodGroups}
                />
            )}
        </div>
    );
}