import { useEffect, useState } from "react";
import api from "../../services/api";
import EditEmployeeModal from "./EditEmployeeModal";

export default function Employees() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [healthExpiry, setHealthExpiry] = useState("");
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => { loadObjects(); }, []);

    const loadObjects = async () => {
        try {
            const res = await api.get("/objects");
            setObjects(res.data);
            if (res.data.length === 1) setSelectedObjectId(res.data[0]._id);
        } catch (err) {
            setError("Грешка при зареждане на обектите");
        }
    };

    useEffect(() => {
        if (!selectedObjectId) { setEmployees([]); return; }
        loadEmployees();
    }, [selectedObjectId]);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/employees/${selectedObjectId}`);
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при зареждане на служителите");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!selectedObjectId) { setError("Избери обект"); return; }
        if (!firstName.trim() || !lastName.trim()) { setError("Ime и фамилия са задължителни"); return; }
        if (!healthExpiry) { setError("Срокът на здравната книжка е задължителен"); return; }
        try {
            await api.post("/employees", {
                object_id: selectedObjectId,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                position: position.trim(),
                health_card_expiry: healthExpiry,
            });
            setFirstName(""); setLastName(""); setPosition(""); setHealthExpiry("");
            loadEmployees();
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при добавяне на служител");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        try {
            await api.delete(`/employees/delete/${id}`);
            loadEmployees();
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    const filtered = employees.filter((e) =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 px-4">
            <h1 className="text-2xl font-semibold">Служители</h1>

            {/* OBJECT SELECT */}
            <section className="bg-white border rounded-xl p-4">
                <label className="block text-sm font-medium mb-2">Изберете обект</label>
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map((o) => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {/* ADD FORM */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-4 md:p-6">
                    <h2 className="text-lg font-semibold mb-4">Добави служител</h2>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Име *"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Фамилия *"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Длъжност"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <input
                            type="date"
                            value={healthExpiry}
                            onChange={(e) => setHealthExpiry(e.target.value)}
                            required
                            className="border px-3 py-2 rounded-md w-full"
                            title="Срок на здравна книжка"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md w-full hover:bg-blue-700"
                        >
                            Добави служител
                        </button>
                    </form>
                    {error && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                </section>
            )}

            {/* SEARCH */}
            {employees.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-2">Търсене</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Търси служител..."
                        className="border px-3 py-2 rounded-md w-full"
                    />
                </div>
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-4 md:p-6 space-y-3">
                    {loading ? (
                        <p className="text-slate-500">Зареждане...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-slate-500">Няма служители</p>
                    ) : (
                        filtered.map((e) => (
                            <div key={e._id} className="border rounded-lg p-3 text-sm space-y-1">
                                <p className="font-medium">{e.first_name} {e.last_name}</p>
                                <p className="text-slate-500">Длъжност: {e.position || "—"}</p>
                                <p className="text-slate-500">
                                    Здравна книжка: {e.health_card_expiry
                                        ? new Date(e.health_card_expiry).toLocaleDateString("bg-BG")
                                        : "—"}
                                </p>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => setEditingEmployee(e)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Редактирай
                                    </button>
                                    <button
                                        onClick={() => onDelete(e._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Изтрий
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            )}

            {editingEmployee && (
                <EditEmployeeModal
                    employee={editingEmployee}
                    onClose={() => setEditingEmployee(null)}
                    onUpdated={loadEmployees}
                />
            )}
        </div>
    );
}