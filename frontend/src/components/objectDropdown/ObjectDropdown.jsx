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

            // ако има само 1 обект → auto select
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
