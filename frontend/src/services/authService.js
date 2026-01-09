import api from "./api";
import { clearUserData } from "../utils/storage";

export const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    return data;
};

export const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
};

export const logout = async () => {
    await api.post("/auth/logout");
    clearUserData();
};