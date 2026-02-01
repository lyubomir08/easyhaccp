import { useEffect, useState } from "react";
import api from "../../services/api";
import EditDisinfectantModal from "./EditDisinfectantModal";

export default function Disinfectants() {
    /* ========= OBJECTS ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    /* ========= DISINFECTANTS ========= */
    const [disinfectants, setDisinfectants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ========= SEARCH ========= */
    const [search, setSearch] = useState("");

    /* ========= CREATE ========= */
    const [name, setName] = useState("");

    /* ========= EDIT MODAL ========= */
    const [editingDisinfectant, setEditingDisinfectant] = useState(null);

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

    /* ========= LOAD DISINFECTANTS ========= */
    useEffect(() => {
        if (!selectedObjectId) {
            setDisinfectants([]);
            return;
        }
        loadDisinfectants();
    }, [selectedObjectId]);

    const loadDisinfectants = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/disinfectants/${selectedObjectId}`);
            setDisinfectants(res.data);
        } catch {
            setError("Грешка при зареждане на дезинфектантите");
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
            await api.post("/disinfectants", {
                object_id: selectedObjectId,
                name: name.trim(),
            });

            setName("");
            loadDisinfectants();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    /* ========= DELETE ========= */
    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;

        try {
            await api.delete(`/disinfectants/delete/${id}`);
            loadDisinfectants();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    /* ========= SEARCH FILTER ========= */
    const filtered = disinfectants.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ========= RENDER ========= */
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Препарати за дезинфекция
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
                            placeholder="Име на дезинфектант"
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
            {disinfectants.length > 0 && (
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Търси дезинфектант..."
                    className="border px-3 py-2 rounded-md w-full"
                />
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-2">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : filtered.length === 0 ? (
                        <p>Няма дезинфектанти</p>
                    ) : (
                        filtered.map((d) => (
                            <div
                                key={d._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span>{d.name}</span>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingDisinfectant(d)}
                                        className="text-blue-600 text-sm"
                                    >
                                        Редактирай
                                    </button>
                                    <button
                                        onClick={() => onDelete(d._id)}
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
            {editingDisinfectant && (
                <EditDisinfectantModal
                    disinfectant={editingDisinfectant}
                    onClose={() => setEditingDisinfectant(null)}
                    onUpdated={loadDisinfectants}
                />
            )}
        </div>
    );
}
