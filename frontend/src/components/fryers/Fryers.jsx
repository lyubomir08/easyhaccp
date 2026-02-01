import { useEffect, useState } from "react";
import api from "../../services/api";
import EditFryerModal from "./EditFryerModal";

export default function Fryers() {
    /* ========= OBJECTS ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    /* ========= FRYERS ========= */
    const [fryers, setFryers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ========= SEARCH ========= */
    const [search, setSearch] = useState("");

    /* ========= CREATE ========= */
    const [name, setName] = useState("");

    /* ========= EDIT ========= */
    const [editingFryer, setEditingFryer] = useState(null);

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
            setError("Грешка при зареждане на обектите");
        }
    };

    /* ========= LOAD FRYERS ========= */
    useEffect(() => {
        if (!selectedObjectId) {
            setFryers([]);
            return;
        }
        loadFryers();
    }, [selectedObjectId]);

    const loadFryers = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/fryers/${selectedObjectId}`);
            setFryers(res.data);
        } catch {
            setError("Грешка при зареждане на фритюрниците");
        } finally {
            setLoading(false);
        }
    };

    /* ========= CREATE ========= */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Името е задължително");
            return;
        }

        try {
            await api.post("/fryers", {
                object_id: selectedObjectId,
                name: name.trim(),
            });

            setName("");
            loadFryers();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    /* ========= DELETE ========= */
    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;

        try {
            await api.delete(`/fryers/delete/${id}`);
            loadFryers();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    /* ========= SEARCH FILTER ========= */
    const filtered = fryers.filter((f) =>
        f.name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ========= RENDER ========= */
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Фритюрници
            </h1>

            {/* OBJECT SELECT */}
            <section className="bg-white border rounded-xl p-4">
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
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
                    <form onSubmit={onSubmit} className="flex gap-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="№ 1, № 2 или име"
                            className="border px-3 py-2 rounded-md flex-1"
                        />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                            Добави
                        </button>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-3 text-sm">{error}</p>
                    )}
                </section>
            )}

            {/* SEARCH */}
            {fryers.length > 0 && (
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Търси фритюрник..."
                    className="border px-3 py-2 rounded-md w-full"
                />
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-2">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : filtered.length === 0 ? (
                        <p>Няма фритюрници</p>
                    ) : (
                        filtered.map((f) => (
                            <div
                                key={f._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span>{f.name}</span>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingFryer(f)}
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

            {/* EDIT MODAL */}
            {editingFryer && (
                <EditFryerModal
                    fryer={editingFryer}
                    onClose={() => setEditingFryer(null)}
                    onUpdated={loadFryers}
                />
            )}
        </div>
    );
}
