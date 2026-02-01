import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProducedFoodEditModal from "./ProducedFoodEditModal";

export default function ProducedFoodDiary() {
    const [objects, setObjects] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [logs, setLogs] = useState([]);

    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        recipe_id: "",
        portions: "",
        ingredient_id: "",
        ingredient_quantity: "",
        ingredient_batch_number: "",
        ingredient_shelf_life: "",
        product_batch_number: "",
        product_shelf_life: "",
        recipe_production_number: "",
        recipe_production_date: ""
    });

    /* OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => {
            // Filter only catering objects
            const cateringObjects = res.data.filter(obj => obj.object_type === "catering");
            setObjects(cateringObjects);
        });
    }, []);

    /* DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        console.log("Loading data for object_id:", form.object_id);

        // Option 1: Try object-specific endpoints
        const loadObjectSpecificData = async () => {
            try {
                // Try recipes by object
                const recipesRes = await api.get(`/recipes/object/${form.object_id}`);
                console.log("Recipes response:", recipesRes.data);
                setRecipes(recipesRes.data);
            } catch (err) {
                console.error("No recipes/object endpoint:", err.response?.status);

                // Fallback: Get food groups first, then recipes
                try {
                    const foodGroupsRes = await api.get(`/food-groups/${form.object_id}`);
                    console.log("Food groups response:", foodGroupsRes.data);
                    setIngredients(foodGroupsRes.data);

                    // Now get recipes for each food group
                    if (foodGroupsRes.data && foodGroupsRes.data.length > 0) {
                        const allRecipes = [];
                        for (const group of foodGroupsRes.data) {
                            try {
                                const groupRecipes = await api.get(`/recipes/group/${group._id}`);
                                console.log(`Recipes for group ${group._id}:`, groupRecipes.data);
                                allRecipes.push(...groupRecipes.data);
                            } catch (err) {
                                console.error(`Error loading recipes for group ${group._id}:`, err);
                            }
                        }
                        setRecipes(allRecipes);
                    }
                } catch (err2) {
                    console.error("Error loading food groups:", err2);
                    setIngredients([]);
                    setRecipes([]);
                }
            }
        };

        loadObjectSpecificData();
        loadLogs();
    }, [form.object_id]);

    const loadLogs = async () => {
        if (!form.object_id) return;
        const res = await api.get(`/produced-foods/${form.object_id}`);
        setLogs(res.data);
    };

    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);

        if (recipe) {
            // Auto-fill срок на годност = текуща дата + 3 часа (за готвени ястия)
            const now = new Date();
            const shelfLife = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3 hours
            const shelfLifeString = shelfLife.toISOString().slice(0, 16);

            // Auto-fill партиден номер = номер на рецепта + дата
            const productBatchNumber = `${recipe.name || 'Рецепта'} - ${now.toLocaleDateString('bg-BG')}`;

            setForm(s => ({
                ...s,
                recipe_id: id,
                product_shelf_life: shelfLifeString,
                product_batch_number: productBatchNumber,
                recipe_production_number: recipe.name || '',
                recipe_production_date: now.toISOString().slice(0, 16)
            }));
        } else {
            setForm(s => ({
                ...s,
                recipe_id: id
            }));
        }
    };

    const onIngredientChange = async (e) => {
        const id = e.target.value;
        const ingredient = ingredients.find(i => i._id === id);

        if (ingredient) {
            // Try to get latest food diary entry for this ingredient to auto-fill batch number and shelf life
            try {
                // Call API to get latest food diary entry for this ingredient
                const response = await api.get(`/food-diary/latest/${form.object_id}/${id}`);
                
                if (response.data) {
                    const latestEntry = response.data;
                    
                    setForm(s => ({
                        ...s,
                        ingredient_id: id,
                        ingredient_batch_number: latestEntry.batch_number || '',
                        ingredient_shelf_life: latestEntry.shelf_life 
                            ? new Date(latestEntry.shelf_life).toISOString().slice(0, 16) 
                            : ''
                    }));
                } else {
                    setForm(s => ({
                        ...s,
                        ingredient_id: id
                    }));
                }
            } catch (err) {
                console.log("No food diary entry found, manual input required");
                setForm(s => ({
                    ...s,
                    ingredient_id: id
                }));
            }
        } else {
            setForm(s => ({
                ...s,
                ingredient_id: id
            }));
        }
    };

    const onChange = e => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    /* CREATE */
    const onSubmit = async e => {
        e.preventDefault();
        setError("");

        // Validation
        if (!form.date) {
            setError("Моля, въведете дата");
            return;
        }

        if (!form.recipe_id && !form.ingredient_id) {
            setError("Моля, изберете рецепта или суровина");
            return;
        }

        try {
            const payload = {
                object_id: form.object_id,
                date: new Date(form.date).toISOString(),
                recipe_id: form.recipe_id || undefined,
                portions: form.portions ? Number(form.portions) : undefined,
                ingredient_id: form.ingredient_id || undefined,
                ingredient_quantity: form.ingredient_quantity ? Number(form.ingredient_quantity) : undefined,
                ingredient_batch_number: form.ingredient_batch_number || undefined,
                ingredient_shelf_life: form.ingredient_shelf_life
                    ? new Date(form.ingredient_shelf_life).toISOString()
                    : undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life
                    ? new Date(form.product_shelf_life).toISOString()
                    : undefined,
                recipe_production_number: form.recipe_production_number || undefined,
                recipe_production_date: form.recipe_production_date
                    ? new Date(form.recipe_production_date).toISOString()
                    : undefined
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            console.log("Sending payload:", payload);
            await api.post("/produced-foods", payload);
            await loadLogs();

            // Reset form
            setForm(s => ({
                ...s,
                date: "",
                recipe_id: "",
                portions: "",
                ingredient_id: "",
                ingredient_quantity: "",
                ingredient_batch_number: "",
                ingredient_shelf_life: "",
                product_batch_number: "",
                product_shelf_life: "",
                recipe_production_number: "",
                recipe_production_date: ""
            }));
        } catch (err) {
            console.error("Full error:", err);
            console.error("Error response:", err.response);
            console.error("Error data:", err.response?.data);

            let errorMessage = "Неизвестна грешка";
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError("Грешка при запис: " + errorMessage);
        }
    };

    /* DELETE */
    const onDelete = async id => {
        if (!confirm("Сигурни ли сте, че искате да изтриете този запис?")) return;

        try {
            await api.delete(`/produced-foods/delete/${id}`);
            await loadLogs();
        } catch (err) {
            console.error(err);
            alert("Грешка при изтриване");
        }
    };

    /* SEARCH */
    const filteredLogs = logs.filter(l =>
        l.recipe_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.ingredient_id?.food_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.product_batch_number?.toLowerCase().includes(search.toLowerCase())
    );

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">
                3.3.7. ПРОИЗВЕДЕНИ ХРАНИ за кетъринг
            </h1>

            <div>
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select
                    name="object_id"
                    value={form.object_id}
                    onChange={onChange}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </div>

            {form.object_id && (
                <>
                    <form
                        onSubmit={onSubmit}
                        className="bg-white border rounded-xl p-6 space-y-4"
                    >
                        <h2 className="text-lg font-semibold">Добави нов запис</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Дата и час <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={form.date}
                                    onChange={onChange}
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Рецепта</label>
                                <select
                                    name="recipe_id"
                                    value={form.recipe_id}
                                    onChange={onRecipeChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери рецепта --</option>
                                    {recipes.length === 0 && (
                                        <option disabled>Няма налични рецепти</option>
                                    )}
                                    {recipes.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                                {recipes.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">Няма рецепти за този обект</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Брой порции</label>
                                <input
                                    type="number"
                                    name="portions"
                                    value={form.portions}
                                    onChange={onChange}
                                    placeholder="Брой порции"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Суровина</label>
                                <select
                                    name="ingredient_id"
                                    value={form.ingredient_id}
                                    onChange={onIngredientChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери суровина --</option>
                                    {ingredients.length === 0 && (
                                        <option disabled>Няма налични суровини</option>
                                    )}
                                    {ingredients.map(i => (
                                        <option key={i._id} value={i._id}>{i.food_name}</option>
                                    ))}
                                </select>
                                {ingredients.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">Няма суровини за този обект</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Количество суровина</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="ingredient_quantity"
                                    value={form.ingredient_quantity}
                                    onChange={onChange}
                                    placeholder="Количество"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Партида суровина</label>
                                <input
                                    name="ingredient_batch_number"
                                    value={form.ingredient_batch_number}
                                    onChange={onChange}
                                    placeholder="Партида суровина"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                {form.ingredient_id && form.ingredient_batch_number && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Автоматично от дневник 3.3.1</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Срок на годност (суровина)</label>
                                <input
                                    type="datetime-local"
                                    name="ingredient_shelf_life"
                                    value={form.ingredient_shelf_life}
                                    onChange={onChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                {form.ingredient_id && form.ingredient_shelf_life && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Автоматично от дневник 3.3.1</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Партида продукт</label>
                                <input
                                    name="product_batch_number"
                                    value={form.product_batch_number}
                                    onChange={onChange}
                                    placeholder="Партида продукт"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                {form.recipe_id && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Автоматично попълнено от рецепта</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Срок на годност (продукт)</label>
                                <input
                                    type="datetime-local"
                                    name="product_shelf_life"
                                    value={form.product_shelf_life}
                                    onChange={onChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                {form.recipe_id && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Автоматично: +3 часа</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Номер на рецепта + дата на производство</label>
                                <input
                                    name="recipe_production_number"
                                    value={form.recipe_production_number}
                                    onChange={onChange}
                                    placeholder="Номер на рецепта"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Дата на производство (рецепта)</label>
                                <input
                                    type="datetime-local"
                                    name="recipe_production_date"
                                    value={form.recipe_production_date}
                                    onChange={onChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-700 text-sm">{error}</p>
                                <p className="text-red-600 text-xs mt-1">Отворете конзолата (F12) за повече детайли</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
                                Запази
                            </button>
                        </div>
                    </form>

                    <div>
                        <label className="block text-sm font-medium mb-2">Търсене</label>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Търси по рецепта, суровина или партида..."
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    <div className="space-y-4">
                        {visibleLogs.map(l => (
                            <div key={l._id} className="bg-white border rounded-xl p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-semibold text-lg">
                                        {l.recipe_id?.name || l.ingredient_id?.food_name || "Без име"}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setEditingLog(l)}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Редактирай
                                        </button>
                                        <button
                                            onClick={() => onDelete(l._id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Изтрий
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500 font-medium">Дата:</span>{" "}
                                        <span className="text-gray-800">
                                            {new Date(l.date).toLocaleString("bg-BG")}
                                        </span>
                                    </div>

                                    {l.recipe_id && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Готов продукт (рецепта):</span>{" "}
                                            <span className="text-red-600 font-semibold">{l.recipe_id.name}</span>
                                        </div>
                                    )}

                                    {l.portions && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Брой порции:</span>{" "}
                                            <span className="text-gray-800">{l.portions}</span>
                                        </div>
                                    )}

                                    {l.ingredient_id && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Суровина:</span>{" "}
                                            <span className="text-green-600 font-semibold">{l.ingredient_id.food_name}</span>
                                        </div>
                                    )}

                                    {l.ingredient_quantity && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Количество суровина:</span>{" "}
                                            <span className="text-gray-800">{l.ingredient_quantity}</span>
                                        </div>
                                    )}

                                    {l.ingredient_batch_number && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Партиден номер на суровината:</span>{" "}
                                            <span className="text-gray-800">{l.ingredient_batch_number}</span>
                                        </div>
                                    )}

                                    {l.ingredient_shelf_life && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Срок на годност (суровина):</span>{" "}
                                            <span className="text-gray-800">
                                                {new Date(l.ingredient_shelf_life).toLocaleString("bg-BG")}
                                            </span>
                                        </div>
                                    )}

                                    {l.product_batch_number && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Партиден номер на готовия продукт:</span>{" "}
                                            <span className="text-gray-800">{l.product_batch_number}</span>
                                        </div>
                                    )}

                                    {l.product_shelf_life && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Срок на годност на готовия продукт:</span>{" "}
                                            <span className="text-gray-800">
                                                {new Date(l.product_shelf_life).toLocaleString("bg-BG")}
                                            </span>
                                        </div>
                                    )}

                                    {l.recipe_production_number && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Номер на рецепта + дата:</span>{" "}
                                            <span className="text-gray-800">{l.recipe_production_number}</span>
                                        </div>
                                    )}

                                    {l.recipe_production_date && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Дата на производство:</span>{" "}
                                            <span className="text-gray-800">
                                                {new Date(l.recipe_production_date).toLocaleString("bg-BG")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {visibleLogs.length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-8">
                                Няма записи
                            </p>
                        )}

                        {!search && logs.length > 10 && (
                            <p className="text-slate-500 text-sm text-center">
                                Показани са последните 10 записа. Използвайте търсенето за повече резултати.
                            </p>
                        )}
                    </div>
                </>
            )}

            {editingLog && (
                <ProducedFoodEditModal
                    log={editingLog}
                    recipes={recipes}
                    ingredients={ingredients}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}