import api from "./api";

export const getUsers = async () => {
    const { data } = await api.get("/users");
    return data;
};

export const getUserById = async (userId) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
};

export const updateUser = async (userId, formData) => {
    const { data } = await api.put(`/users/edit/${userId}`, formData);
    return data;
};

export const deleteUser = async (userId) => {
    const { data } = await api.delete(`/users/delete/${userId}`);
    return data;
};

export const changePassword = async (oldPassword, newPassword) => {
    const { data } = await api.put("/users/change-password", {
        oldPassword,
        newPassword,
    });
    return data;
};

export const updateProfile = async (formData) => {
    const { data } = await api.put("/users/profile", formData);
    return data;
};