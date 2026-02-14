import { useEffect, useState } from "react";
import api from "../../../services/api";
import CookingTemperatureEditModal from "./CookingTemperatureEditModal";

export default function CookingTemperatureDiary() {
    const [objects, setObjects] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);

    const [editingLog, setEditingLog] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        object_id: "",
        date: "",
        food_group_id: "",
        measured_temp: "",
        shelf_life: "",
        employee_id: ""
    });

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => {
            // Filter only catering objects
            const cateringObjects = res.data.filter(obj => obj.object_type === "catering");
            setObjects(cateringObjects);
        });
    }, []);

    /* LOAD DEPENDENCIES */
    useEffect(() => {
        if (!form.object_id) return;

        api.get(`/food-groups/${form.object_id}`).then(r => setFoodGroups(r.data));
        api.get(`/employees/${form.object_id}`).then(r => setEmployees(r.data));
        loadLogs();
    }, [form.object_id]);

    /* LOAD LOGS */
    const loadLogs = async () => {
        if (!form.object_id) return;
        try {
            console.log("Loading logs for object:", form.object_id);
            const res = await api.get(`/cooking-temp/${form.object_id}`);
            console.log("Logs response:", res.data);
            setLogs(res.data);
        } catch (err) {
            console.error("Load logs error:", err.response?.data);
            setLogs([]);
        }
    };

    const onChange = (e) => {
        setForm(s => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onFoodChange = (e) => {
        const id = e.target.value;
        const food = foodGroups.find(f => f._id === id);

        setForm(s => ({
            ...s,
            food_group_id: id,
            measured_temp: food?.cooking_temp || "",
            shelf_life: food?.shelf_life || ""
        }));
    };

    /* CREATE */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const payload = {
                object_id: form.object_id,
                date: new Date(form.date).toISOString(),
                food_group_id: form.food_group_id,
                measured_temp: Number(form.measured_temp),
                shelf_life: form.shelf_life || undefined,
                employee_id: form.employee_id || undefined
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            console.log("Submitting payload:", payload);
            const res = await api.post("/cooking-temp", payload);
            console.log("Post response:", res.data);
            
            await loadLogs();

            // Reset form
            setForm(s => ({
                ...s,
                date: "",
                food_group_id: "",
                measured_temp: "",
                shelf_life: "",
                employee_id: ""
            }));
        } catch (err) {
            console.error("Submit error:", err.response?.data);
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    /* DELETE */
    const onDelete = async (id) => {
        if (!confirm("Сигурни ли сте, че искате да изтриете този запис?")) return;

        try {
            await api.delete(`/cooking-temp/delete/${id}`);
            await loadLogs();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Грешка при изтриване");
        }
    };

    /* SEARCH */
    const filteredLogs = logs.filter(l =>
        l.food_group_id?.food_name?.toLowerCase().includes(search.toLowerCase())
    );

    const visibleLogs = search ? filteredLogs : filteredLogs.slice(0, 10);

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4">
            <h1 className="text-2xl font-semibold">
                Температура на храните при кетъринг
            </h1>

            {/* OBJECT SELECTOR */}
            <div className="bg-white border rounded-xl p-4">
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

            {/* FORM */}
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
                                <label className="block text-sm font-medium mb-1">
                                    Храна <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="food_group_id"
                                    value={form.food_group_id}
                                    onChange={onFoodChange}
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери храна --</option>
                                    {foodGroups.map(f => (
                                        <option key={f._id} value={f._id}>{f.food_name}</option>
                                    ))}
                                </select>
                                {foodGroups.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">Няма налични храни</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Температура (°C) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="measured_temp"
                                    value={form.measured_temp}
                                    onChange={onChange}
                                    placeholder="75°C минимум"
                                    required
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Срок на годност</label>
                                <input
                                    type="text"
                                    name="shelf_life"
                                    value={form.shelf_life}
                                    onChange={onChange}
                                    placeholder="напр. 24 часа"
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Служител</label>
                                <select
                                    name="employee_id"
                                    value={form.employee_id}
                                    onChange={onChange}
                                    className="border px-3 py-2 rounded-md w-full"
                                >
                                    <option value="">-- Избери служител --</option>
                                    {employees.map(e => (
                                        <option key={e._id} value={e._id}>
                                            {e.first_name} {e.last_name}
                                        </option>
                                    ))}
                                </select>
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
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Търси по храна..."
                            className="border px-3 py-2 rounded-md w-full"
                        />
                    </div>

                    {/* LIST */}
                    <div className="space-y-4">
                        {visibleLogs.map(l => (
                            <div
                                key={l._id}
                                className="bg-white border rounded-xl p-5 flex justify-between items-start"
                            >
                                <div className="space-y-1 flex-1">
                                    <h3 className="text-lg font-semibold">
                                        {l.food_group_id?.food_name || "Неизвестна храна"}
                                    </h3>

                                    <div className="text-sm text-slate-600">
                                        Температура:{" "}
                                        <span
                                            className={
                                                l.measured_temp < 75
                                                    ? "text-red-600 font-semibold"
                                                    : "text-green-600 font-medium"
                                            }
                                        >
                                            {l.measured_temp} °C
                                        </span>
                                        {l.measured_temp < 75 && (
                                            <span className="ml-2 text-red-600 text-xs">⚠ Под нормата</span>
                                        )}
                                    </div>

                                    {l.food_group_id?.shelf_life && (
                                        <div className="text-sm text-slate-600">
                                            Годен до:{" "}
                                            <span className="font-medium text-slate-800">
                                                {l.food_group_id.shelf_life}
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-sm text-slate-600">
                                        Служител:{" "}
                                        <span className="font-medium text-slate-800">
                                            {l.employee_id
                                                ? `${l.employee_id.first_name} ${l.employee_id.last_name}`
                                                : "Не е посочен"}
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-400 pt-1">
                                        {new Date(l.date).toLocaleString("bg-BG")}
                                    </div>
                                </div>

                                <div className="flex gap-3 text-sm ml-4">
                                    <button
                                        onClick={() => setEditingLog(l)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Редактирай
                                    </button>
                                    <button
                                        onClick={() => onDelete(l._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Изтрий
                                    </button>
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

            {/* EDIT MODAL */}
            {editingLog && (
                <CookingTemperatureEditModal
                    log={editingLog}
                    foodGroups={foodGroups}
                    employees={employees}
                    onClose={() => setEditingLog(null)}
                    onSaved={loadLogs}
                />
            )}
        </div>
    );
}