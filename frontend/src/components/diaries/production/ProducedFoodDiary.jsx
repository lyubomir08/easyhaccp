import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProducedFoodEditModal from "./ProducedFoodEditModal";

const isExpired = (shelf_life) => {
    if (!shelf_life) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(shelf_life);
    expiry.setHours(0, 0, 0, 0);
    return expiry < today;
};

export default function ProducedFoodDiary() {
    const [objects, setObjects] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [logs, setLogs] = useState([]);
    const [foodLogs, setFoodLogs] = useState([]);
    const [editingLog, setEditingLog] = useState(null);
    const [expandedLog, setExpandedLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [expiredIngredients, setExpiredIngredients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [form, setForm] = useState({
        object_id: "",
        date: "",
        recipe_id: "",
        portions: "",
        product_batch_number: "",
        product_shelf_life: "",
        recipe_production_date: ""
    });

    const fmtDate = (v) => (v ? String(v).split("T")[0] : "");

    useEffect(() => {
        api.get("/objects").then(res => {
            const cateringObjects = res.data.filter(obj => obj.object_type === "catering");
            setObjects(cateringObjects);
        });
    }, []);

    useEffect(() => {
        if (!form.object_id) return;
        loadObjectSpecificData();
        loadLogs(1);
    }, [form.object_id]);

    const loadObjectSpecificData = async () => {
        try {
            try {
                const foodLogsRes = await api.get(`/food-logs/${form.object_id}`);
                const logsData = foodLogsRes.data;
                setFoodLogs(Array.isArray(logsData) ? logsData : logsData?.logs || logsData?.data || []);
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
                } catch { }
            }
            setRecipes(allRecipes);
        } catch {
            setRecipes([]);
        }
    };

    const loadLogs = async (page = 1) => {
        if (!form.object_id) return;
        try {
            const res = await api.get(`/produced-foods/${form.object_id}?page=${page}&limit=10`);
            if (page !== currentPage) setExpandedLog(null);
            setLogs(res.data.logs || []);
            setCurrentPage(res.data.page || 1);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Load logs error:", err.response?.data);
            setLogs([]);
            setCurrentPage(1);
            setTotalPages(1);
        }
    };

    const checkExpiredIngredients = (recipe) => {
        if (!recipe?.ingredients) return [];
        return recipe.ingredients.reduce((acc, ing) => {
            const match = Array.isArray(foodLogs) ? foodLogs.find(fl =>
                fl.product_type?.toLowerCase() === ing.ingredient?.toLowerCase()
            ) : null;
            if (match && isExpired(match.shelf_life)) {
                acc.push({ name: ing.ingredient, shelf_life: match.shelf_life, batch: match.batch_number });
            }
            return acc;
        }, []);
    };

    const onRecipeChange = (e) => {
        const id = e.target.value;
        const recipe = recipes.find(r => r._id === id);
        if (recipe) {
            const now = new Date();
            const recipeNumber = recipe.recipe_number || (recipes.findIndex(r => r._id === id) + 1);
            const productBatchNumber = `Рецепта №${recipeNumber} - ${now.toLocaleDateString("bg-BG")}`;
            const shelfLife = recipe._group_shelf_life || "";
            setExpiredIngredients(checkExpiredIngredients(recipe));
            setForm(s => ({
                ...s,
                recipe_id: id,
                product_batch_number: productBatchNumber,
                product_shelf_life: shelfLife,
                recipe_production_date: now.toISOString()
            }));
        } else {
            setExpiredIngredients([]);
            setForm(s => ({ ...s, recipe_id: id, product_batch_number: "", product_shelf_life: "", recipe_production_date: "" }));
        }
    };

    const onChange = e => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onSubmit = async e => {
        e.preventDefault();
        setError("");
        if (!form.date) { setError("Моля, въведете дата"); return; }
        if (!form.recipe_id) { setError("Моля, изберете рецепта"); return; }
        if (expiredIngredients.length > 0) {
            setError(`Не може да се запази — следните съставки имат изтекъл срок: ${expiredIngredients.map(i => i.name).join(", ")}`);
            return;
        }
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
            await loadLogs(1);
            setExpiredIngredients([]);
            setForm(s => ({ ...s, date: "", recipe_id: "", portions: "", product_batch_number: "", product_shelf_life: "", recipe_production_date: "" }));
        } catch (err) {
            setError("Грешка при запис: " + (err.response?.data?.message || err.message || "Неизвестна грешка"));
        }
    };

    const onDelete = async id => {
        if (!confirm("Сигурни ли сте, че искате да изтриете този запис?")) return;
        try {
            await api.delete(`/produced-foods/delete/${id}`);
            await loadLogs(currentPage);
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

    const filteredLogs = (logs || []).filter(l =>
        (l.recipe_id?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.product_batch_number || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">ПРОИЗВЕДЕНИ ХРАНИ за кетъринг</h1>

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

                        {expiredIngredients.length > 0 && (
                            <div className="bg-red-50 border border-red-300 rounded-md p-4">
                                <p className="text-red-700 font-semibold text-sm mb-2">⛔ Не може да се произведе — изтекли съставки:</p>
                                <ul className="space-y-1">
                                    {expiredIngredients.map((ing, i) => (
                                        <li key={i} className="text-sm text-red-600">
                                            • <strong>{ing.name}</strong> — срок: {new Date(ing.shelf_life).toLocaleDateString("bg-BG")} · Партида: {ing.batch}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {error && <div className="bg-red-50 border border-red-200 rounded-md p-3"><p className="text-red-700 text-sm">{error}</p></div>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={expiredIngredients.length > 0}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Запази
                            </button>
                        </div>
                    </form>

                    <div>
                        <label className="block text-sm font-medium mb-2">Търсене</label>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по рецепта или партида..." className="border px-3 py-2 rounded-md w-full" />
                    </div>

                    <div className="space-y-3">
                        {filteredLogs.map(l => {
                            const isExpanded = expandedLog === l._id;
                            return (
                                <div key={l._id} className="bg-white border rounded-xl overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedLog(isExpanded ? null : l._id)}
                                            className="flex items-center gap-2 text-left flex-1 min-w-0"
                                        >
                                            <span className="text-xl text-slate-400 w-5 text-center leading-none shrink-0">
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                            <div className="min-w-0">
                                                <span className="font-semibold text-slate-800 block truncate">
                                                    {l.recipe_id?.name || "Без ime"}
                                                </span>
                                                <span className="text-sm text-gray-400">
                                                    {new Date(l.date).toLocaleDateString("bg-BG")}
                                                    {l.portions ? ` · ${l.portions} порции` : ""}
                                                </span>
                                            </div>
                                        </button>
                                        <div className="flex gap-3 shrink-0 pl-7 sm:pl-0">
                                            <button onClick={() => setEditingLog(l)} className="text-blue-600 hover:text-blue-800 text-sm">Редактирай</button>
                                            <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800 text-sm">Изтрий</button>
                                        </div>
                                    </div>

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
                                                            const matchingLog = Array.isArray(foodLogs) ? foodLogs.find(fl =>
                                                                fl.product_type?.toLowerCase() === ing.ingredient?.toLowerCase()
                                                            ) : null;
                                                            const expired = matchingLog && isExpired(matchingLog.shelf_life);
                                                            return (
                                                                <div key={idx} className={`flex items-center justify-between border-b last:border-0 py-2 text-sm px-3 rounded ${expired ? "bg-red-50" : "bg-white"}`}>
                                                                    <div>
                                                                        <span className="font-medium text-gray-800">{ing.ingredient}</span>
                                                                        {expired && <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Изтекъл срок</span>}
                                                                        {matchingLog && (
                                                                            <div className={`text-xs mt-0.5 ${expired ? "text-red-600" : "text-orange-600"}`}>
                                                                                Срок: {fmtDate(matchingLog.shelf_life)} · Партида: {matchingLog.batch_number}
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
                        {filteredLogs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">Няма записи</p>}
                    </div>
                </>
            )}

            {form.object_id && logs.length > 0 && totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-4 items-center">
                    <button
                        onClick={() => loadLogs(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Назад
                    </button>
                    <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => loadLogs(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Напред
                    </button>
                </div>
            )}

            {editingLog && (
                <ProducedFoodEditModal
                    log={editingLog}
                    recipes={recipes}
                    foodLogs={Array.isArray(foodLogs) ? foodLogs : []}
                    onClose={() => setEditingLog(null)}
                    onSaved={() => loadLogs(currentPage)}
                />
            )}
        </div>
    );
}