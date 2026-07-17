import { useEffect, useState } from "react";
import api from "../services/api";

export default function ObjectDropdown({ value, onChange }) {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        try {
            const res = await api.get("/objects");
            setObjects(res.data);

            if (res.data.length === 1) {
                onChange(res.data[0]._id);
            }
        } catch (err) {
            console.error("Грешка при зареждане на обекти");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Зареждане на обекти...</p>;
    }

    if (objects.length === 1) {
        return (
            <div className="border rounded-md px-3 py-2 w-full bg-slate-50 text-slate-700">
                {objects[0].name}
            </div>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
        >
            <option value="">-- Избери обект --</option>
            {objects.map((obj) => (
                <option key={obj._id} value={obj._id}>
                    {obj.name}
                </option>
            ))}
        </select>
    );
}