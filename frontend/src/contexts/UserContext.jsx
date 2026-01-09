import { createContext, useState, useEffect } from "react";
import { getUserData, setUserData, clearUserData } from "../utils/storage";
import * as authService from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => getUserData());
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    const [selectedObjectId, setSelectedObjectId] = useState(null);

    useEffect(() => {
        if (!user) {
            clearUserData();
            setSelectedFirmId(null);
            setSelectedObjectId(null);
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
    }, [user]);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data);
    };

    // not logging in
    const register = async (formData) => {
        return await authService.register(formData);
    };

    const logout = async () => {
        await authService.logout();
        clearUserData();
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                role: user?.role,
                selectedFirmId,
                setSelectedFirmId,
                selectedObjectId,
                setSelectedObjectId,
                isAdmin: user?.role === "admin",
                isOwner: user?.role === "owner",
                isManager: user?.role === "manager",
                login,
                register,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};