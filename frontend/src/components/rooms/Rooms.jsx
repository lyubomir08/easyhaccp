import { useEffect, useState } from "react";
import api from "../../services/api";
import EditRoomModal from "./EditRoomModal";

export default function Rooms() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [name, setName] = useState("");

    const [editingRoom, setEditingRoom] = useState(null);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        try {
            const res = await api.get("/objects");
            setObjects(res.data);

            if (res.data.length === 1) {
                setSelectedObjectId(res.data[0]._id);
            } else {
                const saved = localStorage.getItem("easyhaccp_object_id");
                if (saved) {
                    const found = res.data.find(o => o._id === saved);
                    if (found) setSelectedObjectId(saved);
                }
            }
        } catch {
            setError("Грешка при зареждане на обектите");
        }
    };

    useEffect(() => {
        if (!selectedObjectId) {
            setRooms([]);
            return;
        }
        loadRooms();
    }, [selectedObjectId]);

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/rooms/${selectedObjectId}`);
            setRooms(res.data);
        } catch {
            setError("Грешка при зареждане на помещенията");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Името е задължително");
            return;
        }

        try {
            await api.post("/rooms", {
                object_id: selectedObjectId,
                name: name.trim(),
            });

            setName("");
            loadRooms();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при запис");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;

        try {
            await api.delete(`/rooms/delete/${id}`);
            loadRooms();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    const filtered = rooms.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Помещения
            </h1>

            <section className="bg-white border rounded-xl p-4">
                <select
                    value={selectedObjectId}
                    onChange={(e) => {
                        const id = e.target.value;
                        setSelectedObjectId(id);
                        if (id) localStorage.setItem("easyhaccp_object_id", id);
                        else localStorage.removeItem("easyhaccp_object_id");
                    }}
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

            {rooms.length > 0 && (
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Търси помещение..."
                    className="border px-3 py-2 rounded-md w-full"
                />
            )}

            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6 space-y-2">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : filtered.length === 0 ? (
                        <p>Няма помещения</p>
                    ) : (
                        filtered.map((r) => (
                            <div
                                key={r._id}
                                className="flex justify-between items-center border-b py-2"
                            >
                                <span>{r.name}</span>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingRoom(r)}
                                        className="text-blue-600 text-sm"
                                    >
                                        Редактирай
                                    </button>
                                    <button
                                        onClick={() => onDelete(r._id)}
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

            {editingRoom && (
                <EditRoomModal
                    room={editingRoom}
                    onClose={() => setEditingRoom(null)}
                    onUpdated={loadRooms}
                />
            )}
        </div>
    );
}
