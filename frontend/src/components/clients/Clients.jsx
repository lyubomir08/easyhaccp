import { useEffect, useState } from "react";
import api from "../../services/api";
import EditClientModal from "./EditClientModal";

export default function Clients() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const emptyForm = { name: "", address: "", registration_number: "" };
    const [form, setForm] = useState(emptyForm);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        api.get("/objects")
            .then(res => {
                setObjects(res.data);
                if (res.data.length === 1) setSelectedObjectId(res.data[0]._id);
            })
            .catch(() => setError("Грешка при зареждане на обектите"));
    }, []);

    useEffect(() => {
        if (!selectedObjectId) { setClients([]); return; }
        setLoading(true);
        setError("");
        api.get(`/clients/${selectedObjectId}`)
            .then(res => setClients(res.data))
            .catch(err => setError(err.response?.data?.message || "Грешка при зареждане на клиентите"))
            .finally(() => setLoading(false));
    }, [selectedObjectId]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const selectedObject = objects.find(o => o._id === selectedObjectId);
        try {
            await api.post("/clients", {
                object_id: selectedObjectId,
                firm_id: selectedObject.firm_id,
                name: form.name.trim(),
                address: form.address.trim(),
                registration_number: form.registration_number.trim(),
            });
            setForm(emptyForm);
            const res = await api.get(`/clients/${selectedObjectId}`);
            setClients(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при добавяне на клиент");
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;
        try {
            await api.delete(`/clients/delete/${id}`);
            const res = await api.get(`/clients/${selectedObjectId}`);
            setClients(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4">
            <h1 className="text-2xl font-semibold">Клиенти (контрагенти)</h1>

            {/* OBJECT SELECT */}
            <section className="bg-white border rounded-xl p-4">
                <select
                    value={selectedObjectId}
                    onChange={(e) => setSelectedObjectId(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="">-- Избери обект --</option>
                    {objects.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                </select>
            </section>

            {/* CREATE */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-4 md:p-6">
                    <h2 className="text-lg font-medium mb-4">Добавяне на клиент</h2>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Име на фирмата"
                            required
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <input
                            name="address"
                            value={form.address}
                            onChange={onChange}
                            placeholder="Адрес"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <input
                            name="registration_number"
                            value={form.registration_number}
                            onChange={onChange}
                            placeholder="Регистрационен №"
                            className="border px-3 py-2 rounded-md w-full"
                        />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md w-full md:w-auto md:self-end">
                            Добави
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
                </section>
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-4 md:p-6">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : clients.length === 0 ? (
                        <p>Няма клиенти</p>
                    ) : (
                        <div className="space-y-3">
                            {clients.map(c => (
                                <div key={c._id} className="border rounded-lg p-3 text-sm space-y-1">
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-slate-500">Адрес: {c.address || "—"}</p>
                                    <p className="text-slate-500">Рег. №: {c.registration_number || "—"}</p>
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={() => setEditingClient(c)}
                                            className="text-blue-600 text-sm"
                                        >
                                            Редактирай
                                        </button>
                                        <button
                                            onClick={() => onDelete(c._id)}
                                            className="text-red-600 text-sm"
                                        >
                                            Изтрий
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {editingClient && (
                <EditClientModal
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onUpdated={async () => {
                        const res = await api.get(`/clients/${selectedObjectId}`);
                        setClients(res.data);
                    }}
                />
            )}
        </div>
    );
}