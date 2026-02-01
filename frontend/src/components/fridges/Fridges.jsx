import { useEffect, useState } from "react";
import api from "../../services/api";
import EditFridgeModal from "./EditFridgeModal";

export default function Fridges() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    const [fridges, setFridges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        norm_min: "",
        norm_max: "",
    });

    const [editingFridge, setEditingFridge] = useState(null);

    /* LOAD OBJECTS */
    useEffect(() => {
        api.get("/objects").then(res => {
            setObjects(res.data);
            if (res.data.length === 1) {
                setSelectedObjectId(res.data[0]._id);
            }
        });
    }, []);

    /* LOAD FRIDGES */
    useEffect(() => {
        if (!selectedObjectId) {
            setFridges([]);
            return;
        }

        setLoading(true);
        api.get(`/fridges/${selectedObjectId}`)
            .then(res => setFridges(res.data))
            .catch(() => setError("Грешка при зареждане"))
            .finally(() => setLoading(false));
    }, [selectedObjectId]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    /* CREATE */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/fridges", {
                object_id: selectedObjectId,
                name: form.name.trim() || undefined,
                norm_min: Number(form.norm_min),
                norm_max: Number(form.norm_max),
            });

            setForm({ name: "", norm_min: "", norm_max: "" });

            const res = await api.get(`/fridges/${selectedObjectId}`);
            setFridges(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при добавяне");
        }
    };

    /* DELETE */
    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;

        await api.delete(`/fridges/delete/${id}`);
        const res = await api.get(`/fridges/${selectedObjectId}`);
        setFridges(res.data);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Хладилни съоръжения</h1>

            {/* OBJECT */}
            <section className="bg-white border rounded-xl p-4">
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
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
                        Добавяне на хладилно съоръжение
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="№ / Име (по желание)"
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            type="number"
                            name="norm_min"
                            value={form.norm_min}
                            onChange={onChange}
                            placeholder="Норма от (°C)"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            type="number"
                            name="norm_max"
                            value={form.norm_max}
                            onChange={onChange}
                            placeholder="Норма до (°C)"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <div className="md:col-span-3 flex justify-end">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                                Добави
                            </button>
                        </div>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-3 text-sm">{error}</p>
                    )}
                </section>
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-2">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : fridges.length === 0 ? (
                        <p>Няма хладилници</p>
                    ) : (
                        fridges.map((f, i) => (
                            <div
                                key={f._id}
                                className="border rounded-md p-3 flex justify-between"
                            >
                                <div>
                                    <strong>{f.name || `№ ${i + 1}`}</strong>
                                    <div className="text-sm text-slate-600">
                                        Норма: {f.norm_min}°C → {f.norm_max}°C
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingFridge(f)}
                                        className="text-blue-600 text-sm"
                                    >
                                        Редактирай
                                    </button>
                                    <button
                                        onClick={() => onDelete(f._id)}
                                        className="text-red-600 text-sm"
                                    >
                                        Изтрий
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            )}

            {editingFridge && (
                <EditFridgeModal
                    fridge={editingFridge}
                    onClose={() => setEditingFridge(null)}
                    onUpdated={async () => {
                        const res = await api.get(
                            `/fridges/${selectedObjectId}`
                        );
                        setFridges(res.data);
                    }}
                />
            )}
        </div>
    );
}
