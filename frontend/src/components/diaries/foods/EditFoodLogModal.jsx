import { useState } from "react";
import api from "../../../services/api";

export default function EditFoodLogModal({
  log,
  suppliers,
  employees,
  onClose,
  onUpdated,
}) {
  const grams = log.quantity ?? 0;
  const useKg = grams >= 1000;

  const [unit, setUnit] = useState(useKg ? "кг" : "гр");
  const [form, setForm] = useState({
    date: String(log.date).slice(0, 10),
    supplier_id: log.supplier_id?._id || log.supplier_id || "",
    product_type: log.product_type || "",
    batch_number: log.batch_number || "",
    shelf_life: log.shelf_life ? String(log.shelf_life).slice(0, 10) : "",
    quantity: useKg ? parseFloat((grams / 1000).toFixed(3)) : grams,
    transport_type: log.transport_type || "",
    document: log.document || "",
    employee_id: log.employee_id?._id || log.employee_id || "",
  });

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const quantityInGrams = unit === "кг"
        ? Math.round(Number(form.quantity) * 1000)
        : Math.round(Number(form.quantity));

      await api.put(`/food-logs/edit/${log._id}`, {
        date: form.date,
        supplier_id: form.supplier_id,
        product_type: form.product_type,
        batch_number: form.batch_number,
        shelf_life: form.shelf_life,
        quantity: quantityInGrams,
        transport_type: form.transport_type,
        document: form.document,
        employee_id: form.employee_id,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating:", err.response?.data || err);
      alert(err.response?.data?.message || "Грешка при редактиране");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Редактиране на запис</h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              required
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Доставчик</label>
            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={onChange}
              required
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="">-- Избери доставчик --</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Вид храна</label>
            <input
              type="text"
              name="product_type"
              value={form.product_type}
              onChange={onChange}
              placeholder="напр. Пиле, Свинско, Домати"
              required
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Партиден номер</label>
            <input
              type="text"
              name="batch_number"
              value={form.batch_number}
              onChange={onChange}
              required
              placeholder="Партиден номер"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Срок на годност</label>
            <input
              type="date"
              name="shelf_life"
              value={form.shelf_life}
              onChange={onChange}
              required
              className="border px-3 py-2 rounded-md w-full"
            />
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
                onChange={onChange}
                required
                placeholder={unit === "кг" ? "напр. 5.5" : "напр. 500"}
                className="border px-3 py-2 rounded-md flex-1 min-w-0"
              />
              <div className="flex border rounded-md overflow-hidden shrink-0">
                {["кг", "гр"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-3 py-2 text-sm font-medium transition ${unit === u ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Вид на използвания транспорт</label>
            <input
              type="text"
              name="transport_type"
              value={form.transport_type}
              onChange={onChange}
              placeholder="напр. хладилен камион"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Придружителен документ/сертификат</label>
            <input
              type="text"
              name="document"
              value={form.document}
              onChange={onChange}
              placeholder="Документ"
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Служител</label>
            <select
              name="employee_id"
              value={form.employee_id}
              onChange={onChange}
              required
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="">-- Избери служител --</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.first_name} {e.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Отказ
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Запази
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
