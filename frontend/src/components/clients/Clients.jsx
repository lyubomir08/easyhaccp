import { useEffect, useState } from "react";
import api from "../../services/api";
import EditClientModal from "./EditClientModal";

export default function Clients() {
    /* ========= OBJECTS ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    /* ========= CLIENTS ========= */
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ========= FORM ========= */
    const emptyForm = {
        name: "",
        address: "",
        registration_number: "",
    };

    const [form, setForm] = useState(emptyForm);

    /* ========= EDIT ========= */
    const [editingClient, setEditingClient] = useState(null);

    /* ========= LOAD OBJECTS ========= */
    useEffect(() => {
        api.get("/objects")
            .then(res => {
                setObjects(res.data);
                if (res.data.length === 1) {
                    setSelectedObjectId(res.data[0]._id);
                }
            })
            .catch(() => setError("Грешка при зареждане на обектите"));
    }, []);

    /* ========= LOAD CLIENTS ========= */
    useEffect(() => {
        if (!selectedObjectId) {
            setClients([]);
            return;
        }

        setLoading(true);
        setError("");

        api.get(`/clients/${selectedObjectId}`)
            .then(res => setClients(res.data))
            .catch(err => {
                setError(
                    err.response?.data?.message ||
                    "Грешка при зареждане на клиентите"
                );
            })
            .finally(() => setLoading(false));
    }, [selectedObjectId]);

    /* ========= FORM CHANGE ========= */
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    /* ========= CREATE ========= */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const selectedObject = objects.find(
            o => o._id === selectedObjectId
        );

        try {
            await api.post("/clients", {
                object_id: selectedObjectId,
                firm_id: selectedObject.firm_id, // ✅ ВАЖНО
                name: form.name.trim(),
                address: form.address.trim(),
                registration_number: form.registration_number.trim(),
            });

            setForm(emptyForm);

            const res = await api.get(`/clients/${selectedObjectId}`);
            setClients(res.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Грешка при добавяне на клиент"
            );
        }
    };

    /* ========= DELETE ========= */
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

    /* ========= RENDER ========= */
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">
                Клиенти (контрагенти)
            </h1>

            {/* OBJECT SELECT */}
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
                        Добавяне на клиент
                    </h2>

                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Име на фирмата"
                            required
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            name="address"
                            value={form.address}
                            onChange={onChange}
                            placeholder="Адрес"
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            name="registration_number"
                            value={form.registration_number}
                            onChange={onChange}
                            placeholder="Регистрационен №"
                            className="border px-3 py-2 rounded-md md:col-span-2"
                        />

                        <div className="md:col-span-2 flex justify-end">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                                Добави
                            </button>
                        </div>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-3 text-sm">
                            {error}
                        </p>
                    )}
                </section>
            )}

            {/* LIST */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : clients.length === 0 ? (
                        <p>Няма клиенти</p>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Име</th>
                                    <th className="text-left py-2">Адрес</th>
                                    <th className="text-left py-2">Рег. №</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(c => (
                                    <tr key={c._id} className="border-b">
                                        <td className="py-2">{c.name}</td>
                                        <td className="py-2">{c.address || "—"}</td>
                                        <td className="py-2">{c.registration_number || "—"}</td>
                                        <td className="flex gap-3 py-2 justify-end">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}

            {/* EDIT MODAL */}
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
