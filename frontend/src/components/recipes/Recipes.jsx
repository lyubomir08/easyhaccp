import { useEffect, useState } from "react";
import api from "../../services/api";
import EditRecipeModal from "./EditRecipeModal";

export default function Recipes() {
    /* ========= OBJECT ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [selectedObject, setSelectedObject] = useState(null);

    /* ========= FOOD GROUPS ========= */
    const [foodGroups, setFoodGroups] = useState([]);

    /* ========= RECIPES ========= */
    const [recipes, setRecipes] = useState([]);

    /* ========= SEARCH ========= */
    const [search, setSearch] = useState("");

    /* ========= EDIT ========= */
    const [editingRecipe, setEditingRecipe] = useState(null);

    /* ========= FORM ========= */
    const emptyItem = {
        food_group_id: "",
        product: "",
        quantity: "",
    };

    const [form, setForm] = useState({
        name: "",
        items: [{ ...emptyItem }],
    });

    /* ========= LOAD OBJECTS ========= */
    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        const res = await api.get("/objects");
        setObjects(res.data);

        if (res.data.length === 1) {
            setSelectedObjectId(res.data[0]._id);
            setSelectedObject(res.data[0]);
        }
    };

    /* ========= LOAD FOOD GROUPS ========= */
    useEffect(() => {
        if (!selectedObjectId) return;

        const object = objects.find(o => o._id === selectedObjectId);
        setSelectedObject(object);

        loadFoodGroups();
    }, [selectedObjectId]);

    const loadFoodGroups = async () => {
        const res = await api.get(`/food-groups/${selectedObjectId}`);
        setFoodGroups(res.data);
    };

    /* ========= LOAD RECIPES ========= */
    useEffect(() => {
        if (foodGroups.length) {
            loadRecipes();
        } else {
            setRecipes([]);
        }
    }, [foodGroups]);

    const loadRecipes = async () => {
        const requests = foodGroups.map(f =>
            api.get(`/recipes/group/${f._id}`)
        );

        const responses = await Promise.all(requests);
        const allRecipes = responses.flatMap(r => r.data);

        setRecipes(allRecipes);
    };

    const needsQuantity =
        selectedObject?.object_type === "catering" ||
        selectedObject?.object_type === "restaurant";

    /* ========= FORM HELPERS ========= */
    const addItem = () => {
        setForm(s => ({
            ...s,
            items: [...s.items, { ...emptyItem }],
        }));
    };

    const removeItem = (index) => {
        setForm(s => ({
            ...s,
            items: s.items.filter((_, i) => i !== index),
        }));
    };

    const onChangeItem = (index, field, value) => {
        const items = [...form.items];
        items[index][field] = value;
        setForm(s => ({ ...s, items }));
    };

    /* ========= CREATE ========= */
    const onSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            food_group_id: form.items[0].food_group_id,
            ingredients: form.items.map(i => ({
                ingredient: i.product,
                quantity: i.quantity ? Number(i.quantity) : undefined,
            })),
        };

        await api.post("/recipes", payload);

        setForm({
            name: "",
            items: [{ ...emptyItem }],
        });

        loadRecipes();
    };

    /* ========= DELETE ========= */
    const deleteRecipe = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        await api.delete(`/recipes/delete/${id}`);
        loadRecipes();
    };

    /* ========= SEARCH FILTER ========= */
    const filteredRecipes = recipes.filter(r => {
        const text = search.toLowerCase();
        return (
            r.name.toLowerCase().includes(text) ||
            r.ingredients.some(i =>
                i.ingredient.toLowerCase().includes(text)
            )
        );
    });

    /* ========= RENDER ========= */
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Рецепти</h1>

            {/* OBJECT */}
            <section className="bg-white border rounded-xl p-4">
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {/* CREATE */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">
                        Добавяне на рецепта
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm(s => ({ ...s, name: e.target.value }))
                            }
                            placeholder="Име на рецепта"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />

                        {form.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <select
                                    value={item.food_group_id}
                                    onChange={(e) =>
                                        onChangeItem(idx, "food_group_id", e.target.value)
                                    }
                                    className="border px-3 py-2 rounded-md flex-1"
                                    required
                                >
                                    <option value="">Вид храна</option>
                                    {foodGroups.map(f => (
                                        <option key={f._id} value={f._id}>
                                            {f.food_name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    value={item.product}
                                    onChange={(e) =>
                                        onChangeItem(idx, "product", e.target.value)
                                    }
                                    placeholder="Продукт"
                                    className="border px-3 py-2 rounded-md flex-1"
                                    required
                                />

                                {needsQuantity && (
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            onChangeItem(idx, "quantity", e.target.value)
                                        }
                                        placeholder="Кол-во"
                                        className="border px-3 py-2 rounded-md w-28"
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="text-red-600 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4 border-t">
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-blue-600 text-sm"
                            >
                                + Добави още продукт
                            </button>

                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                                Добави рецепта
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* SEARCH */}
            {recipes.length > 0 && (
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Търси рецепта или продукт..."
                    className="border px-3 py-2 rounded-md w-full"
                />
            )}

            {/* LIST */}
            <section className="space-y-3">
                {filteredRecipes.map(r => (
                    <div key={r._id} className="border p-4 rounded-md bg-white">
                        <div className="flex justify-between">
                            <strong>{r.name}</strong>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingRecipe(r)}
                                    className="text-blue-600 text-sm"
                                >
                                    Редактирай
                                </button>
                                <button
                                    onClick={() => deleteRecipe(r._id)}
                                    className="text-red-600 text-sm"
                                >
                                    Изтрий
                                </button>
                            </div>
                        </div>

                        <ul className="text-sm mt-2">
                            {r.ingredients.map((i, idx) => (
                                <li key={idx}>
                                    • {i.ingredient}
                                    {i.quantity && ` (${i.quantity})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {editingRecipe && (
                <EditRecipeModal
                    recipe={editingRecipe}
                    foodGroups={foodGroups}
                    needsQuantity={needsQuantity}
                    onClose={() => setEditingRecipe(null)}
                    onUpdated={loadRecipes}
                />
            )}
        </div>
    );
}
