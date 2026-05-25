import { useEffect, useState } from "react";
import api from "../../../services/api";
import EditFoodLogModal from "./EditFoodLogModal";

const getExpiryStatus = (shelf_life) => {
    if (!shelf_life) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(shelf_life);
    expiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { expired: true, label: `Изтекъл преди ${Math.abs(daysLeft)} дни` };
    if (daysLeft === 0) return { expired: true, label: "Изтича днес" };
    if (daysLeft <= 3) return { warning: true, label: `Изтича след ${daysLeft} дни` };
    return null;
};

const formatQuantity = (grams) => {
    if (!grams && grams !== 0) return "—";
    if (grams >= 1000) {
        const kg = grams / 1000;
        return kg % 1 === 0 ? `${kg} кг` : `${parseFloat(kg.toFixed(3))} кг`;
    }
    return `${grams} гр`;
};

export default function FoodsDiary() {
    const [objects, setObjects] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [quantityUnit, setQuantityUnit] = useState("kg");
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [inputMode, setInputMode] = useState(null);

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        supplier_id: "",
        product_type: "",
        batch_number: "",
        shelf_life: "",
        quantity: "",
        transport_type: "",
        document: "",
        employee_id: ""
    });

    useEffect(() => {
        api.get("/objects").then(res => {
            setObjects(res.data);
            const saved = localStorage.getItem("easyhaccp_object_id");
            if (saved) {
                const found = res.data.find(o => o._id === saved);
                if (found) {
                    setSelectedObject(found);
                    setForm(s => ({ ...s, object_id: saved }));
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!form.object_id) return;
        api.get(`/suppliers/object/${form.object_id}`).then(r => setSuppliers(r.data));
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data));
        loadLogs(1);
    }, [form.object_id]);

    const loadLogs = async (page = 1) => {
        const res = await api.get(`/food-logs/${form.object_id}?page=${page}&limit=10`);
        const logs = (res.data.logs || []).filter(l => Number(l.quantity || 0) > 0);
        setAllLogs(logs);
        setCurrentPage(res.data.page);
        setTotalPages(res.data.totalPages);
    };

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const toGrams = (value, unit) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 0;
        return unit === "kg" ? Math.round(num * 1000) : Math.round(num);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const quantityInGrams = toGrams(form.quantity, quantityUnit);
            await api.post("/food-logs", {
                object_id: form.object_id,
                date: form.date,
                supplier_id: form.supplier_id,
                product_type: form.product_type,
                batch_number: form.batch_number,
                shelf_life: form.shelf_life,
                quantity: quantityInGrams,
                transport_type: form.transport_type,
                document: form.document,
                employee_id: form.employee_id
            });
            loadLogs();
            setForm(s => ({
                ...s,
                date: "",
                supplier_id: "",
                product_type: "",
                batch_number: "",
                shelf_life: "",
                quantity: "",
                transport_type: "",
                document: "",
                employee_id: ""
            }));
        } catch (err) {
            console.error("Error details:", err.response?.data);
            setError(err.response?.data?.message || "Грешка при запазване");
        }
    };

    const onSubmitImageOnly = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const formData = new FormData();
            formData.append("object_id", form.object_id);
            if (image) formData.append("image", image);
            await api.post("/food-logs", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            loadLogs();
            setImage(null);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запазване");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        await api.delete(`/food-logs/delete/${id}`);
        loadLogs();
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filteredLogs = allLogs.filter(l => {
        const t = search.toLowerCase();
        return (
            (l.product_type || "").toLowerCase().includes(t) ||
            (l.batch_number || "").toLowerCase().includes(t)
        );
    });

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    const isRetailOrWholesale = selectedObject &&
        ["retail", "wholesale"].includes(selectedObject.object_type);

    const isRestaurantOrCatering = selectedObject &&
        ["restaurant", "catering"].includes(selectedObject.object_type);

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">Дневник за храни и опаковки</h1>

            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select
                    name="object_id"
                    value={form.object_id}
                    onChange={(e) => {
                        const id = e.target.value;
                        setForm(s => ({ ...s, object_id: id }));
                        setSelectedObject(objects.find(o => o._id === id));
                        setImage(null);
                        if (id) localStorage.setItem("easyhaccp_object_id", id);
                        else localStorage.removeItem("easyhaccp_object_id");
                    }}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {form.object_id && isRetailOrWholesale && (
                <div className="flex gap-3">
                    <button
                        onClick={() => setInputMode("table")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${inputMode === "table" ? "bg-blue-600 text-white" : "border border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                    >
                        Таблица
                    </button>
                    <button
                        onClick={() => setInputMode("image")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${inputMode === "image" ? "bg-blue-600 text-white" : "border border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                    >
                        Снимка
                    </button>
                </div>
            )}

            {form.object_id && (isRestaurantOrCatering || inputMode === "table") && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Добави нов запис</h2>
                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Дата</label>
                            <input type="date" name="date" value={form.date} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Доставчик</label>
                            <select name="supplier_id" value={form.supplier_id} onChange={onChange} required className="border px-3 py-2 rounded-md w-full">
                                <option value="">-- Избери доставчик --</option>
                                {suppliers.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Вид храна</label>
                            <input type="text" name="product_type" value={form.product_type} onChange={onChange} placeholder="напр. Пиле, Свинско, Домати" required className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Партиден номер</label>
                            <input type="text" name="batch_number" value={form.batch_number} placeholder="Партиден номер" onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Срок на годност</label>
                            <input type="date" name="shelf_life" value={form.shelf_life} onChange={onChange} required className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Количество</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    name="quantity"
                                    value={form.quantity}
                                    placeholder={quantityUnit === "kg" ? "напр. 5.5" : "напр. 500"}
                                    onChange={onChange}
                                    required
                                    className="border px-3 py-2 rounded-md flex-1 min-w-0"
                                />
                                <div className="flex border rounded-md overflow-hidden shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQuantityUnit("kg")}
                                        className={`px-3 py-2 text-sm font-medium transition ${quantityUnit === "kg" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        кг
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQuantityUnit("gr")}
                                        className={`px-3 py-2 text-sm font-medium transition border-l ${quantityUnit === "gr" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        гр
                                    </button>
                                </div>
                            </div>
                            {form.quantity && (
                                <p className="text-xs text-blue-600 mt-1">
                                    = {formatQuantity(toGrams(form.quantity, quantityUnit))} ще се запише
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Вид на използвания транспорт</label>
                            <input type="text" name="transport_type" value={form.transport_type} onChange={onChange} placeholder="напр. хладилен камион" className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Придружителен документ/сертификат</label>
                            <input type="text" name="document" value={form.document} onChange={onChange} placeholder="Документ" className="border px-3 py-2 rounded-md w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Служител</label>
                            <select name="employee_id" value={form.employee_id} onChange={onChange} required className="border px-3 py-2 rounded-md w-full">
                                <option value="">-- Избери служител --</option>
                                {employees.map(e => (
                                    <option key={e._id} value={e._id}>{e.first_name} {e.last_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                Запази
                            </button>
                        </div>

                        {error && <p className="md:col-span-3 text-red-500 text-sm">{error}</p>}
                    </form>
                </section>
            )}

            {form.object_id && isRetailOrWholesale && inputMode === "image" && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Качи снимка</h2>
                    <form onSubmit={onSubmitImageOnly} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Снимка</label>
                            <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
                                <span className="text-gray-600">📷 Избери снимка</span>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                            </label>
                            {image && <p className="text-sm text-green-600 mt-2">Избрана снимка: {image.name}</p>}
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                Запази снимката
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                </section>
            )}

            {form.object_id && (isRestaurantOrCatering || inputMode !== null) && inputMode !== "image" && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Търси по вид храна или партиден номер..." className="border px-3 py-2 rounded-md w-full" />
                </div>
            )}

            {form.object_id && (isRestaurantOrCatering || inputMode !== null) && inputMode !== "image" && (
                <div className="space-y-3">
                    {visibleLogs.map(l => {
                        const status = getExpiryStatus(l.shelf_life);
                        const isExpanded = expandedIds.has(l._id);
                        return (
                            <div
                                key={l._id}
                                className={`border rounded-xl overflow-hidden ${status?.expired ? "border-red-200" : status?.warning ? "border-yellow-200" : "border-slate-200"}`}
                            >
                                <div
                                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 cursor-pointer select-none gap-2 ${status?.expired ? "bg-red-50" : status?.warning ? "bg-yellow-50" : "bg-white"}`}
                                    onClick={() => toggleExpand(l._id)}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <span className={`text-lg font-bold leading-none transition-transform shrink-0 mt-0.5 ${isExpanded ? "rotate-45" : ""}`}>+</span>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold break-words">{l.product_type}</span>
                                                {status?.expired && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">Изтекъл срок</span>
                                                )}
                                                {status?.warning && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full whitespace-nowrap">{status.label}</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                Срок на годност: {l.shelf_life ? new Date(l.shelf_life).toLocaleDateString("bg-BG") : "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 text-sm shrink-0 pl-7 sm:pl-0" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => setEditingLog(l)} className="text-blue-600 hover:text-blue-800">Редактирай</button>
                                        <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800">Изтрий</button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className={`px-5 pb-4 pt-2 border-t text-sm text-slate-600 space-y-1 ${status?.expired ? "bg-red-50 border-red-100" : status?.warning ? "bg-yellow-50 border-yellow-100" : "bg-white border-slate-100"}`}>
                                        <div>Партиден номер: <span className="font-medium text-slate-800">{l.batch_number || "—"}</span></div>
                                        <div>Количество: <span className="font-medium text-slate-800">{formatQuantity(l.quantity)}</span></div>
                                        {l.transport_type && <div>Транспорт: <span className="font-medium text-slate-800">{l.transport_type}</span></div>}
                                        {l.document && <div>Документ: <span className="font-medium text-slate-800">{l.document}</span></div>}
                                        {l.created_at && (
                                            <div className="text-xs text-slate-400 pt-1">
                                                Създаден: {new Date(l.created_at).toLocaleString("bg-BG")}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {visibleLogs.length === 0 && <p className="text-slate-500 text-sm">Няма резултати</p>}
                    {!search && allLogs.length > 10 && (
                        <p className="text-slate-500 text-sm text-center">
                            Показани са последните 10 записа. Използвайте търсенето за повече резултати.
                        </p>
                    )}
                </div>
            )}

            {form.object_id && isRetailOrWholesale && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allLogs.filter(l => l.image_url).map(l => (
                        <div key={l._id} className="bg-white border rounded-xl p-4 space-y-3">
                            <img src={l.image_url} alt="Снимка към записа" onClick={() => setPreviewImage(l.image_url)} className="w-full h-56 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition" />
                            {l.created_at && <div className="text-xs text-slate-500">Качена на: {new Date(l.created_at).toLocaleString("bg-BG")}</div>}
                            <div className="flex gap-3 text-sm">
                                <button onClick={() => onDelete(l._id)} className="text-red-600 hover:text-red-800">Изтрий</button>
                            </div>
                        </div>
                    ))}
                    {allLogs.filter(l => l.image_url).length === 0 && <p className="text-slate-500 text-sm">Няма качени снимки</p>}
                </div>
            )}

            {form.object_id && allLogs.length > 0 && (
                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={() => loadLogs(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">Назад</button>
                    <span className="self-center text-sm">Страница {currentPage} от {totalPages}</span>
                    <button onClick={() => loadLogs(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">Напред</button>
                </div>
            )}

            {previewImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-5xl max-h-[90vh] w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setPreviewImage(null)} className="absolute top-2 right-2 bg-white text-black rounded-full w-10 h-10 text-xl shadow">×</button>
                        <img src={previewImage} alt="Преглед на снимка" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}

            {editingLog && (
                <EditFoodLogModal
                    log={editingLog}
                    suppliers={suppliers}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onUpdated={loadLogs}
                />
            )}
        </div>
    );
}