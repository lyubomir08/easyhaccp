import { createContext, useState, useEffect } from "react";
import { getUserData, setUserData, clearUserData } from "../utils/storage";
import * as authService from "../services/authService";
import api from "../services/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => getUserData());
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [objectTypes, setObjectTypes] = useState([]); // ["catering", "wholesale", ...]

    useEffect(() => {
        if (!user) {
            clearUserData();
            setSelectedFirmId(null);
            setSelectedObjectId(null);
            setObjectTypes([]);
            return;
        }

        setUserData(user);

        if (user.role === "manager") {
            setSelectedFirmId(user.firm_id);
            setSelectedObjectId(user.object_id);
        }

        if (user.role === "owner") {
            setSelectedFirmId(user.firm_id);
        }

        // Зареди типовете обекти
        if (user.role !== "admin") {
            api.get("/objects").then(res => {
                const types = res.data.map(o => o.object_type).filter(Boolean);
                setObjectTypes([...new Set(types)]);
            }).catch(() => setObjectTypes([]));
        } else {
            // Админът вижда всичко
            setObjectTypes(["catering", "wholesale"]);
        }
    }, [user]);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data);
    };

    const register = async (formData) => {
        return await authService.register(formData);
    };

    const logout = async () => {
        await authService.logout();
        clearUserData();
        setUser(null);
    };

    const isCatering = objectTypes.includes("catering");
    const isWholesale = objectTypes.includes("wholesale");

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                role: user?.role,
                selectedFirmId,
                setSelectedFirmId,
                selectedObjectId,
                setSelectedObjectId,
                isAdmin: user?.role === "admin",
                isOwner: user?.role === "owner",
                isManager: user?.role === "manager",
                objectTypes,
                isCatering,
                isWholesale,
                login,
                register,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};