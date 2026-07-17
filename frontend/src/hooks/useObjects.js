import { useEffect, useState } from "react";
import api from "../services/api";

export default function useObjects() {
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [loadingObjects, setLoadingObjects] = useState(true);

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        try {
            setLoadingObjects(true);
            const res = await api.get("/objects");
            setObjects(res.data);
            if (res.data.length === 1) {
                setSelectedObjectId(res.data[0]._id);
            }
        } catch (err) {
            console.error("Грешка при зареждане на обектите");
        } finally {
            setLoadingObjects(false);
        }
    };

    const isSingleObject = objects.length === 1;

    return {
        objects,
        selectedObjectId,
        setSelectedObjectId,
        loadingObjects,
        isSingleObject,
        selectedObjectName: isSingleObject ? objects[0].name : null,
    };
}