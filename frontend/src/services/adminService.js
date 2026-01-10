import api from "./api";

export const getInactiveUsers = async () => {
    const { data } = await api.get("/admin/inactive-users");
    return data;
};

export const activateUser = async (userId) => {
    const { data } = await api.put(`/admin/activate-user/${userId}`);
    return data;
};

export const getInactiveFirms = async () => {
    const { data } = await api.get("/admin/inactive-firms");
    return data;
};

export const activateFirm = async (firmId) => {
    const { data } = await api.put(`/admin/activate-firm/${firmId}`);
    return data;
};