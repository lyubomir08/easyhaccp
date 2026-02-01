import { useEffect, useState } from "react";
import api from "../../services/api";
import EditFoodGroupModal from "./EditFoodGroupModal";

export default function FoodGroups() {
    /* ========= OBJECTS ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    /* ========= FOOD GROUPS ========= */
    const [foodGroups, setFoodGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ========= SEARCH + PAGINATION ========= */
    const [search, setSearch] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);

    /* ========= CREATE FORM ========= */
    const [form, setForm] = useState({
        food_name: "",
        food_type: "",
        cooking_temp: "",
        shelf_life: "",
    });

    /* ========= EDIT ========= */
    const [editingGroup, setEditingGroup] = useState(null);

    /* ========= LOAD OBJECTS ========= */
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

    /* ========= LOAD FOOD GROUPS ========= */
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
            setError(
                err.response?.data?.message ||
                "Грешка при зареждане на групите"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ========= FORM ========= */
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({
            ...s,
            [name]:
                name === "cooking_temp"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value,
        }));
    };

    /* ========= CREATE ========= */
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
                food_type: form.food_type.trim() || undefined,
                cooking_temp:
                    form.cooking_temp === "" ? undefined : form.cooking_temp,
                shelf_life: form.shelf_life.trim(),
            });

            setForm({
                food_name: "",
                food_type: "",
                cooking_temp: "",
                shelf_life: "",
            });

            loadFoodGroups();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Нямаш права за добавяне"
            );
        }
    };

    /* ========= DELETE ========= */
    const onDelete = async (groupId) => {
        if (!confirm("Сигурен ли си?")) return;

        try {
            await api.delete(`/food-groups/delete/${groupId}`);
            loadFoodGroups();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Грешка при изтриване"
            );
        }
    };

    /* ========= SEARCH FILTER ========= */
    const filteredFoodGroups = foodGroups.filter((g) => {
        const text = search.toLowerCase();
        return (
            g.food_name.toLowerCase().includes(text) ||
            (g.food_type && g.food_type.toLowerCase().includes(text))
        );
    });

    const visibleFoodGroups = filteredFoodGroups.slice(0, visibleCount);

    /* ========= RENDER ========= */
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Групи храни</h1>

            {/* OBJECT SELECT */}
            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm mb-1">Обект</label>
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map((o) => (
                        <option key={o._id} value={o._id}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </section>

            {/* CREATE */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">
                        Добавяне на група
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            name="food_name"
                            value={form.food_name}
                            onChange={onChange}
                            placeholder="Име"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            name="food_type"
                            value={form.food_type}
                            onChange={onChange}
                            placeholder="Тип"
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

                        <button className="bg-blue-600 text-white rounded-md px-4 py-2 md:col-span-2">
                            Добави
                        </button>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-3 text-sm">{error}</p>
                    )}
                </section>
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Търси по име или тип..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setVisibleCount(10);
                        }}
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
                                    <li
                                        key={g._id}
                                        className="border p-3 rounded-md flex justify-between items-center"
                                    >
                                        <div>
                                            <strong>{g.food_name}</strong>
                                            {g.food_type && ` – ${g.food_type}`}
                                            {g.cooking_temp !== undefined &&
                                                ` | ${g.cooking_temp}°C`}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setEditingGroup(g)}
                                                className="text-blue-600 text-sm"
                                            >
                                                Редактирай
                                            </button>
                                            <button
                                                onClick={() => onDelete(g._id)}
                                                className="text-red-600 text-sm"
                                            >
                                                Изтрий
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {filteredFoodGroups.length > visibleCount && (
                                <div className="text-center pt-4">
                                    <button
                                        onClick={() =>
                                            setVisibleCount((c) => c + 10)
                                        }
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

            {/* EDIT MODAL */}
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
