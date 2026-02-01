import { useEffect, useState } from "react";
import api from "../../services/api";
import EditSupplierModal from "./EditSupplierModal";

export default function Suppliers() {
    /* ========= OBJECTS ========= */
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    /* ========= SUPPLIERS ========= */
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ========= FORM ========= */
    const emptyForm = {
        name: "",
        address: "",
        goods_type: "",
        registration_number: "",
    };
    const [form, setForm] = useState(emptyForm);

    /* ========= EDIT ========= */
    const [editingSupplier, setEditingSupplier] = useState(null);

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

    /* ========= LOAD SUPPLIERS ========= */
    useEffect(() => {
        if (!selectedObjectId) {
            setSuppliers([]);
            return;
        }

        setLoading(true);
        setError("");

        api.get(`/suppliers/object/${selectedObjectId}`)
            .then(res => setSuppliers(res.data))
            .catch(err => {
                setError(
                    err.response?.data?.message ||
                    "Грешка при зареждане на доставчиците"
                );
            })
            .finally(() => setLoading(false));
    }, [selectedObjectId]);

    /* ========= FORM ========= */
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
    };

    /* ========= CREATE ========= */
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/suppliers", {
                object_id: selectedObjectId,
                name: form.name.trim(),
                address: form.address.trim(),
                goods_type: form.goods_type.trim(),
                registration_number: form.registration_number.trim(),
            });

            setForm(emptyForm);

            const res = await api.get(`/suppliers/object/${selectedObjectId}`);
            setSuppliers(res.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Нямаш права или има грешка при добавяне"
            );
        }
    };

    /* ========= DELETE ========= */
    const onDelete = async (id) => {
        if (!confirm("Сигурен ли си?")) return;

        try {
            await api.delete(`/suppliers/delete/${id}`);
            const res = await api.get(`/suppliers/object/${selectedObjectId}`);
            setSuppliers(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Грешка при изтриване");
        }
    };

    /* ========= RENDER ========= */
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Доставчици</h1>

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

            {/* CREATE – ВИНАГИ ВИДИМО */}
            {selectedObjectId && (
                <section className="bg-white border rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">
                        Добавяне на доставчик
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
                            name="goods_type"
                            value={form.goods_type}
                            onChange={onChange}
                            placeholder="Вид на стоката"
                            className="border px-3 py-2 rounded-md"
                        />

                        <input
                            name="registration_number"
                            value={form.registration_number}
                            onChange={onChange}
                            placeholder="Регистрационен №"
                            className="border px-3 py-2 rounded-md"
                        />

                        <div className="md:col-span-2 flex justify-end">
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
                <section className="bg-white border rounded-xl p-6">
                    {loading ? (
                        <p>Зареждане...</p>
                    ) : suppliers.length === 0 ? (
                        <p>Няма доставчици</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Име</th>
                                    <th className="text-left py-2">Адрес</th>
                                    <th className="text-left py-2">Вид стока</th>
                                    <th className="text-left py-2">Рег. №</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map(s => (
                                    <tr key={s._id} className="border-b">
                                        <td className="py-2">{s.name}</td>
                                        <td className="py-2">{s.address}</td>
                                        <td className="py-2">{s.goods_type}</td>
                                        <td className="py-2">{s.registration_number}</td>
                                        <td className="flex gap-3 py-2">
                                            <button
                                                onClick={() => setEditingSupplier(s)}
                                                className="text-blue-600"
                                            >
                                                Редактирай
                                            </button>
                                            <button
                                                onClick={() => onDelete(s._id)}
                                                className="text-red-600"
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

            {/* EDIT */}
            {editingSupplier && (
                <EditSupplierModal
                    supplier={editingSupplier}
                    onClose={() => setEditingSupplier(null)}
                    onUpdated={async () => {
                        const res = await api.get(
                            `/suppliers/object/${selectedObjectId}`
                        );
                        setSuppliers(res.data);
                    }}
                />
            )}
        </div>
    );
}
