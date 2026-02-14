import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProducedFoodEditModal from "./ProducedFoodEditModal";

export default function ProducedFoodDiary() {
    const [objects, setObjects] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [foodLogs, setFoodLogs] = useState([]);
    const [logs, setLogs] = useState([]);

    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [selectedFoodLogId, setSelectedFoodLogId] = useState("");

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
        recipe_production_date: ""
    });

    /* OBJECTS - само кетъринг */
    useEffect(() => {
        api.get("/objects").then(res => {
            const cateringObjects = res.data.filter(obj => obj.object_type === "catering");
            setObjects(cateringObjects);
        });
    }, []);

    /* DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        const loadObjectSpecificData = async () => {
            // Рецепти
            try {
                const recipesRes = await api.get(`/recipes/object/${form.object_id}`);
                setRecipes(recipesRes.data);
            } catch {
                try {
                    const foodGroupsRes = await api.get(`/food-groups/${form.object_id}`);
                    const allRecipes = [];
                    for (const group of foodGroupsRes.data) {
                        try {
                            const groupRecipes = await api.get(`/recipes/group/${group._id}`);
                            allRecipes.push(...groupRecipes.data);
                        } catch {}
                    }
                    setRecipes(allRecipes);
                } catch {
                    setRecipes([]);
                }
            }

            // Суровини от дневник 3.3.1
            try {
                const foodLogsRes = await api.get(`/food-logs/${form.object_id}`);
                setFoodLogs(foodLogsRes.data);
            } catch {
                setFoodLogs([]);
            }
        };

        loadObjectSpecificData();
        loadLogs();
    }, [form.object_id]);

    const loadLogs = async () => {
        if (!form.object_id) return;
        try {
            const res = await api.get(`/produced-foods/${form.object_id}`);
            setLogs(res.data);
        } catch {
            setLogs([]);
        }
    };

    /* ИЗБОР НА РЕЦЕПТА - партида = номер + дата/час, автоматично взима датата */
    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);

        if (recipe) {
            const now = new Date();
            const recipeNumber = recipe.recipe_number || (recipes.findIndex(r => r._id === id) + 1);
            const productBatchNumber = `Рецепта №${recipeNumber} - ${now.toLocaleDateString("bg-BG")}`;

            setForm(s => ({
                ...s,
                recipe_id: id,
                product_batch_number: productBatchNumber,
                product_shelf_life: recipe.shelf_life || "3 часа",
                recipe_production_date: now.toISOString()  // Автоматично взима текущата дата
            }));
        } else {
            setForm(s => ({ ...s, recipe_id: id }));
        }
    };

    /* ИЗБОР НА СУРОВИНА ОТ ДНЕВНИК 3.3.1 */
    const onFoodLogChange = (e) => {
        const id = e.target.value;
        setSelectedFoodLogId(id);

        if (!id) {
            setForm(s => ({
                ...s,
                ingredient_id: "",
                ingredient_quantity: "",
                ingredient_batch_number: "",
                ingredient_shelf_life: ""
            }));
            return;
        }

        try {
            const foodLog = foodLogs.find(f => f._id === id);
            if (!foodLog) return;

            const ingredientId = foodLog.food_group_id
                ? (typeof foodLog.food_group_id === "object" ? foodLog.food_group_id._id : foodLog.food_group_id)
                : "";

            let shelfLife = "";
            if (foodLog.shelf_life) {
                // Check if shelf_life is a valid date or just a string like "3 часа"
                const dateValue = new Date(foodLog.shelf_life);
                if (!isNaN(dateValue.getTime())) {
                    // Valid date - format it
                    shelfLife = dateValue.toLocaleString("bg-BG", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                    });
                } else {
                    // Not a date - use as is (e.g., "3 часа")
                    shelfLife = foodLog.shelf_life;
                }
            }

            setForm(s => ({
                ...s,
                ingredient_id: String(ingredientId || ""),
                ingredient_batch_number: foodLog.batch_number || "",
                ingredient_shelf_life: shelfLife
            }));
        } catch (err) {
            console.error("Error in onFoodLogChange:", err);
        }
    };

    const onChange = e => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    /* CREATE */
    const onSubmit = async e => {
        e.preventDefault();
        setError("");

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
                ingredient_shelf_life: form.ingredient_shelf_life || undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life || undefined,
                recipe_production_date: form.recipe_production_date || undefined
            };

            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            await api.post("/produced-foods", payload);
            await loadLogs();

            setSelectedFoodLogId("");
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
                recipe_production_date: ""
            }));
        } catch (err) {
            console.error("Full error:", err);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || "Неизвестна грешка";
            setError("Грешка при запис: " + errorMessage);
        }
    };

    /* DELETE */
    const onDelete = async id => {
        if (!confirm("Сигурни ли сте, че искате да изтриете този запис?")) return;
        try {
            await api.delete(`/produced-foods/delete/${id}`);
            await loadLogs();
        } catch {
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

                            {/* ДАТА */}
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

                            {/* СУРОВИНА ОТ ДНЕВНИК 3.3.1 */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Суровина (от дневник 3.3.1)
                                </label>
                                <select
                                    value={selectedFoodLogId}
                                    onChange={onFoodLogChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери суровина --</option>
                                    {foodLogs.map(f => (
                                        <option key={f._id} value={f._id}>
                                            {f.food_group_id?.food_name || f.product_type} — Партида: {f.batch_number}
                                        </option>
                                    ))}
                                </select>
                                {foodLogs.length === 0 && (
                                    <p className="text-xs text-orange-500 mt-1">
                                        Няма суровини в дневник 3.3.1
                                    </p>
                                )}
                            </div>

                            {/* КОЛИЧЕСТВО СУРОВИНА */}
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

                            {/* ПАРТИДА СУРОВИНА - автоматично */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Партиден номер (суровина)</label>
                                <input
                                    type="text"
                                    name="ingredient_batch_number"
                                    value={form.ingredient_batch_number}
                                    onChange={onChange}
                                    placeholder="Автоматично от дневник 3.3.1"
                                    className={`border px-3 py-2 rounded-md w-full ${form.ingredient_batch_number ? "bg-blue-50 border-blue-300" : ""}`}
                                />
                                {form.ingredient_batch_number && (
                                    <p className="text-xs text-blue-600 mt-1">✓ От дневник 3.3.1</p>
                                )}
                            </div>

                            {/* СРОК НА СУРОВИНА - string */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Срок на годност (суровина)</label>
                                <input
                                    type="text"
                                    name="ingredient_shelf_life"
                                    value={form.ingredient_shelf_life}
                                    onChange={onChange}
                                    placeholder="Автоматично от дневник 3.3.1"
                                    readOnly={!!selectedFoodLogId}
                                    className={`border px-3 py-2 rounded-md w-full ${form.ingredient_shelf_life ? "bg-blue-50 border-blue-300" : ""}`}
                                />
                                {form.ingredient_shelf_life && (
                                    <p className="text-xs text-blue-600 mt-1">✓ От дневник 3.3.1</p>
                                )}
                            </div>

                            {/* РЕЦЕПТА */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Количество ГОТОВ ПРОДУКТ - РЕЦЕПТИ
                                </label>
                                <select
                                    name="recipe_id"
                                    value={form.recipe_id}
                                    onChange={onRecipeChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери рецепта --</option>
                                    {recipes.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                                {recipes.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">Няма рецепти</p>
                                )}
                            </div>

                            {/* БРОЙ ПОРЦИИ */}
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

                            {/* ПАРТИДА ПРОДУКТ */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Партиден номер на готовия продукт
                                </label>
                                <input
                                    type="text"
                                    name="product_batch_number"
                                    value={form.product_batch_number}
                                    readOnly
                                    placeholder="Автоматично при избор на рецепта"
                                    className={`border px-3 py-2 rounded-md w-full ${form.product_batch_number ? "bg-blue-50 border-blue-300" : "bg-slate-50"}`}
                                />
                                {form.product_batch_number && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Номер на рецепта + дата</p>
                                )}
                            </div>

                            {/* СРОК НА ПРОДУКТ */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Срок на годност на готовия продукт
                                </label>
                                <input
                                    type="text"
                                    name="product_shelf_life"
                                    value={form.product_shelf_life}
                                    onChange={onChange}
                                    placeholder="напр. 3 часа"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                {form.recipe_id && form.product_shelf_life && (
                                    <p className="text-xs text-blue-600 mt-1">✓ Автоматично</p>
                                )}
                            </div>

                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-700 text-sm">{error}</p>
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

                    {/* SEARCH */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Търсене</label>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Търси по рецепта, суровина или партида..."
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    {/* LIST */}
                    <div className="space-y-4">
                        {visibleLogs.map(l => (
                            <div key={l._id} className="bg-white border rounded-xl p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-semibold text-lg">
                                        {l.recipe_id?.name || l.ingredient_id?.food_name || "Без име"}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setEditingLog(l)} className="text-blue-600 hover:text-blue-800 text-sm">
                                            Редактирай
                                        </button>
                                        <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800 text-sm">
                                            Изтрий
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500 font-medium">Дата:</span>{" "}
                                        <span className="text-gray-800">{new Date(l.date).toLocaleString("bg-BG")}</span>
                                    </div>

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
                                            <span className="text-gray-500 font-medium">Партида суровина:</span>{" "}
                                            <span className="text-gray-800">{l.ingredient_batch_number}</span>
                                        </div>
                                    )}

                                    {l.ingredient_shelf_life && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Срок суровина:</span>{" "}
                                            <span className="text-gray-800">{l.ingredient_shelf_life}</span>
                                        </div>
                                    )}

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

                                    {l.product_batch_number && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Партида продукт:</span>{" "}
                                            <span className="text-gray-800">{l.product_batch_number}</span>
                                        </div>
                                    )}

                                    {l.product_shelf_life && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Срок продукт:</span>{" "}
                                            <span className="text-gray-800">{l.product_shelf_life}</span>
                                        </div>
                                    )}

                                    {l.recipe_production_date && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Произведено на:</span>{" "}
                                            <span className="text-gray-800">{new Date(l.recipe_production_date).toLocaleString("bg-BG")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {visibleLogs.length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-8">Няма записи</p>
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
                    foodLogs={foodLogs}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}