import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProducedFoodEditModal from "./ProducedFoodEditModal";

export default function ProducedFoodDiary() {
    const [objects, setObjects] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [logs, setLogs] = useState([]);
    const [foodLogs, setFoodLogs] = useState([]);
    const [editingLog, setEditingLog] = useState(null);
    const [expandedLog, setExpandedLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        recipe_id: "",
        portions: "",
        product_batch_number: "",
        product_shelf_life: "",
        recipe_production_date: ""
    });

    useEffect(() => {
        api.get("/objects").then(res => {
            const cateringObjects = res.data.filter(obj => obj.object_type === "catering");
            setObjects(cateringObjects);
        });
    }, []);

    useEffect(() => {
        if (!form.object_id) return;
        loadObjectSpecificData();
        loadLogs();
    }, [form.object_id]);

    const loadObjectSpecificData = async () => {
        try {
            // Зареди дневник 3.3.1 за срокове на съставките
            try {
                const foodLogsRes = await api.get(`/food-logs/${form.object_id}`);
                setFoodLogs(foodLogsRes.data);
            } catch { setFoodLogs([]); }

            const foodGroupsRes = await api.get(`/food-groups/${form.object_id}`);
            const allRecipes = [];
            for (const group of foodGroupsRes.data) {
                try {
                    const groupRecipes = await api.get(`/recipes/group/${group._id}`);
                    const recipesWithShelfLife = groupRecipes.data.map(r => ({
                        ...r,
                        _group_shelf_life: group.shelf_life
                    }));
                    allRecipes.push(...recipesWithShelfLife);
                } catch {}
            }
            setRecipes(allRecipes);
        } catch {
            setRecipes([]);
        }
    };

    const loadLogs = async () => {
        if (!form.object_id) return;
        try {
            const res = await api.get(`/produced-foods/${form.object_id}`);
            setLogs(res.data);
        } catch {
            setLogs([]);
        }
    };

    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);
        if (recipe) {
            const now = new Date();
            const recipeNumber = recipe.recipe_number || (recipes.findIndex(r => r._id === id) + 1);
            const productBatchNumber = `Рецепта №${recipeNumber} - ${now.toLocaleDateString("bg-BG")}`;
            const shelfLife = recipe._group_shelf_life || "";
            setForm(s => ({
                ...s,
                recipe_id: id,
                product_batch_number: productBatchNumber,
                product_shelf_life: shelfLife,
                recipe_production_date: now.toISOString()
            }));
        } else {
            setForm(s => ({ ...s, recipe_id: id, product_batch_number: "", product_shelf_life: "", recipe_production_date: "" }));
        }
    };

    const onChange = e => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onSubmit = async e => {
        e.preventDefault();
        setError("");
        if (!form.date) { setError("Моля, въведете дата"); return; }
        if (!form.recipe_id) { setError("Моля, изберете рецепта"); return; }
        try {
            const payload = {
                object_id: form.object_id,
                date: new Date(form.date).toISOString(),
                recipe_id: form.recipe_id,
                portions: form.portions ? Number(form.portions) : undefined,
                product_batch_number: form.product_batch_number || undefined,
                product_shelf_life: form.product_shelf_life || undefined,
                recipe_production_date: form.recipe_production_date || undefined
            };
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
            await api.post("/produced-foods", payload);
            await loadLogs();
            setForm(s => ({ ...s, date: "", recipe_id: "", portions: "", product_batch_number: "", product_shelf_life: "", recipe_production_date: "" }));
        } catch (err) {
            setError("Грешка при запис: " + (err.response?.data?.message || err.message || "Неизвестна грешка"));
        }
    };

    const onDelete = async id => {
        if (!confirm("Сигурни ли сте, че искате да изтриете този запис?")) return;
        try {
            await api.delete(`/produced-foods/delete/${id}`);
            await loadLogs();
        } catch {
            alert("Грешка при изтриване");
        }
    };

    const formatAmount = (g) => {
        if (g >= 1000) {
            const kg = g / 1000;
            return kg % 1 === 0 ? `${kg} кг` : `${parseFloat(kg.toFixed(2))} кг`;
        }
        return `${g} гр`;
    };

    const filteredLogs = logs.filter(l =>
        l.recipe_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.product_batch_number?.toLowerCase().includes(search.toLowerCase())
    );
    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold"> ПРОИЗВЕДЕНИ ХРАНИ за кетъринг</h1>

            <div>
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select name="object_id" value={form.object_id} onChange={onChange} className="border px-3 py-2 rounded-md w-full">
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
            </div>

            {form.object_id && (
                <>
                    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Добави нов запис</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Дата и час <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Готов продукт - Рецепти <span className="text-red-500">*</span></label>
                                <select name="recipe_id" value={form.recipe_id} onChange={onRecipeChange} className="border px-3 py-2 rounded-md w-full" required>
                                    <option value="">-- Избери рецепта --</option>
                                    {recipes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                </select>
                                {recipes.length === 0 && <p className="text-xs text-gray-500 mt-1">Няма рецепти</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Брой порции</label>
                                <input type="number" name="portions" value={form.portions} onChange={onChange} placeholder="Брой порции" className="border px-3 py-2 rounded-md w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Партиден номер на готовия продукт</label>
                                <input type="text" name="product_batch_number" value={form.product_batch_number} readOnly placeholder="Автоматично при избор на рецепта" className={`border px-3 py-2 rounded-md w-full ${form.product_batch_number ? "bg-blue-50 border-blue-300" : "bg-slate-50"}`} />
                                {form.product_batch_number && <p className="text-xs text-blue-600 mt-1">✓ Номер на рецепта + дата</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Срок на годност на готовия продукт</label>
                                <input type="text" name="product_shelf_life" value={form.product_shelf_life} onChange={onChange} placeholder="Автоматично от вида храна" className={`border px-3 py-2 rounded-md w-full ${form.product_shelf_life ? "bg-blue-50 border-blue-300" : ""}`} />
                                {form.recipe_id && form.product_shelf_life && <p className="text-xs text-blue-600 mt-1">✓ От вида храна</p>}
                            </div>
                        </div>
                        {error && <div className="bg-red-50 border border-red-200 rounded-md p-3"><p className="text-red-700 text-sm">{error}</p></div>}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Запази</button>
                        </div>
                    </form>

                    <div>
                        <label className="block text-sm font-medium mb-2">Търсене</label>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по рецепта или партида..." className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div className="space-y-3">
                        {visibleLogs.map(l => {
                            const isExpanded = expandedLog === l._id;
                            return (
                                <div key={l._id} className="bg-white border rounded-xl overflow-hidden">
                                    {/* Заглавен ред */}
                                    <div className="flex justify-between items-center px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedLog(isExpanded ? null : l._id)}
                                            className="flex items-center gap-3 text-left flex-1"
                                        >
                                            <span className="text-2xl text-slate-400 w-5 text-center leading-none">
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {l.recipe_id?.name || "Без ime"}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {new Date(l.date).toLocaleDateString("bg-BG")}
                                                {l.portions ? ` · ${l.portions} порции` : ""}
                                            </span>
                                        </button>
                                        <div className="flex gap-3 ml-4 shrink-0">
                                            <button onClick={() => setEditingLog(l)} className="text-blue-600 hover:text-blue-800 text-sm">Редактирай</button>
                                            <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800 text-sm">Изтрий</button>
                                        </div>
                                    </div>

                                    {/* Разгъната информация */}
                                    {isExpanded && (
                                        <div className="border-t px-5 py-4 space-y-4 bg-slate-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                                <div><span className="text-gray-500 font-medium">Дата:</span> <span className="text-gray-800">{new Date(l.date).toLocaleString("bg-BG")}</span></div>
                                                {l.recipe_id && <div><span className="text-gray-500 font-medium">Готов продукт:</span> <span className="text-red-600 font-semibold">{l.recipe_id.name}</span></div>}
                                                {l.portions && <div><span className="text-gray-500 font-medium">Брой порции:</span> <span className="text-gray-800">{l.portions}</span></div>}
                                                {l.product_batch_number && <div><span className="text-gray-500 font-medium">Партида продукт:</span> <span className="text-gray-800">{l.product_batch_number}</span></div>}
                                                {l.product_shelf_life && <div><span className="text-gray-500 font-medium">Срок продукт:</span> <span className="text-gray-800">{l.product_shelf_life}</span></div>}
                                                {l.recipe_production_date && <div><span className="text-gray-500 font-medium">Произведено на:</span> <span className="text-gray-800">{new Date(l.recipe_production_date).toLocaleString("bg-BG")}</span></div>}
                                            </div>

                                            {l.recipe_id?.ingredients?.length > 0 && (
                                                <div className="border-t pt-3">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                                        Необходими продукти{l.portions ? ` за ${l.portions} порции` : ""}:
                                                    </p>
                                                    <div className="space-y-1">
                                                        {l.recipe_id.ingredients.map((ing, idx) => {
                                                            const totalGrams = ing.quantity && l.portions ? ing.quantity * l.portions : null;
                                                            // Търси срока в дневник 3.3.1 по name
                                                                const matchingLog = foodLogs.find(fl =>
                                                                    fl.product_type?.toLowerCase() === ing.ingredient?.toLowerCase()
                                                                );
                                                                return (
                                                                    <div key={idx} className="flex items-center justify-between border-b last:border-0 py-2 text-sm bg-white px-3 rounded">
                                                                        <div>
                                                                            <span className="font-medium text-gray-800">{ing.ingredient}</span>
                                                                            {matchingLog && (
                                                                                <div className="text-xs text-orange-600 mt-0.5">
                                                                                    Срок: {matchingLog.shelf_life} · Партида: {matchingLog.batch_number}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-gray-500 text-right">
                                                                            {ing.quantity ? (
                                                                                <>
                                                                                    {ing.quantity} гр./порция
                                                                                    {totalGrams && <span className="ml-2 text-blue-600 font-semibold">= {formatAmount(totalGrams)}</span>}
                                                                                </>
                                                                            ) : "—"}
                                                                        </span>
                                                                    </div>
                                                                );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {visibleLogs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">Няма записи</p>}
                        {!search && logs.length > 10 && <p className="text-slate-500 text-sm text-center">Показани са последните 10 записа. Използвайте търсенето за повече резултати.</p>}
                    </div>
                </>
            )}

            {editingLog && (
                <ProducedFoodEditModal
                    log={editingLog}
                    recipes={recipes}
                    foodLogs={[]}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}