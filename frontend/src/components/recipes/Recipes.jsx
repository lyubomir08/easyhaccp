import { useEffect, useState } from "react";
import api from "../../services/api";
import EditRecipeModal from "./EditRecipeModal";

export default function Recipes() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [selectedObject, setSelectedObject] = useState(null);
    const [foodGroups, setFoodGroups] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [editingRecipe, setEditingRecipe] = useState(null);

    const [form, setForm] = useState({
        name: "",
        food_group_id: "",
        items: [{ product: "", quantity: "" }],
    });

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

    useEffect(() => {
        if (foodGroups.length) {
            loadRecipes();
        } else {
            setRecipes([]);
        }
    }, [foodGroups]);

    const loadRecipes = async () => {
        const requests = foodGroups.map(f => api.get(`/recipes/group/${f._id}`));
        const responses = await Promise.all(requests);
        const allRecipes = responses.flatMap(r => r.data);
        setRecipes(allRecipes);
    };

    const addItem = () => {
        setForm(s => ({
            ...s,
            items: [...s.items, { product: "", quantity: "" }],
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

    const onSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            food_group_id: form.food_group_id,
            ingredients: form.items.map(i => ({
                ingredient: i.product,
                quantity: i.quantity ? Number(i.quantity) : undefined,
            })),
        };

        await api.post("/recipes", payload);

        setForm({
            name: "",
            food_group_id: "",
            items: [{ product: "", quantity: "" }],
        });

        loadRecipes();
    };

    const deleteRecipe = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        await api.delete(`/recipes/delete/${id}`);
        loadRecipes();
    };

    const filteredRecipes = recipes.filter(r => {
        const text = search.toLowerCase();
        return (
            r.name.toLowerCase().includes(text) ||
            r.ingredients.some(i => i.ingredient.toLowerCase().includes(text))
        );
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">Рецепти</h1>

            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Избери обект</label>
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

            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Добавяне на рецепта</h2>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Име на рецепта *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                                    placeholder="Име на рецепта"
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Вид храна *</label>
                                <select
                                    value={form.food_group_id}
                                    onChange={(e) => setForm(s => ({ ...s, food_group_id: e.target.value }))}
                                    className="border px-3 py-2 rounded-md w-full"
                                    required
                                >
                                    <option value="">-- Избери вид храна --</option>
                                    {foodGroups.map(f => (
                                        <option key={f._id} value={f._id}>{f.food_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium mb-2">Съставки</label>
                            {form.items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-3 mb-3">
                                    <div className="col-span-7">
                                        <input
                                            value={item.product}
                                            onChange={(e) => onChangeItem(idx, "product", e.target.value)}
                                            placeholder="Продукт"
                                            className="border px-3 py-2 rounded-md w-full"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.quantity}
                                            onChange={(e) => onChangeItem(idx, "quantity", e.target.value)}
                                            placeholder="Количество (гр.)"
                                            className="border px-3 py-2 rounded-md w-full"
                                        />
                                    </div>

                                    <div className="col-span-1 flex items-center">
                                        {form.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="text-red-600 text-lg hover:text-red-800 w-full"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-4 border-t">
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-blue-600 text-sm hover:text-blue-800"
                            >
                                + Добави още продукт
                            </button>

                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                Добави рецепта
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {recipes.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Търси рецепта или продукт..."
                        className="border px-3 py-2 rounded-md w-full"
                    />
                </div>
            )}

            <section className="space-y-3">
                {filteredRecipes.map(r => (
                    <div key={r._id} className="border p-4 rounded-md bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <strong className="text-lg">{r.name}</strong>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingRecipe(r)}
                                    className="text-blue-600 text-sm hover:text-blue-800"
                                >
                                    Редактирай
                                </button>
                                <button
                                    onClick={() => deleteRecipe(r._id)}
                                    className="text-red-600 text-sm hover:text-red-800"
                                >
                                    Изтрий
                                </button>
                            </div>
                        </div>

                        <ul className="text-sm mt-2 space-y-1">
                            {r.ingredients.map((i, idx) => (
                                <li key={idx} className="text-gray-700">
                                    • {i.ingredient}
                                    {i.quantity && ` — ${i.quantity}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {filteredRecipes.length === 0 && recipes.length > 0 && (
                    <p className="text-gray-500 text-center py-8">Няма резултати</p>
                )}

                {recipes.length === 0 && selectedObjectId && (
                    <p className="text-gray-500 text-center py-8">Няма добавени рецепти</p>
                )}
            </section>

            {editingRecipe && (
                <EditRecipeModal
                    recipe={editingRecipe}
                    foodGroups={foodGroups}
                    needsQuantity={true}
                    onClose={() => setEditingRecipe(null)}
                    onUpdated={loadRecipes}
                />
            )}
        </div>
    );
} 