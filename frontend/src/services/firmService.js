import api from "./api";

export const getAllFirms = async () => {
    const { data } = await api.get("/firms");
    return data;
};

export const getMyFirm = async () => {
    const { data } = await api.get("/firms/my");
    return data;
};

export const getFirmById = async (firmId) => {
    const { data } = await api.get(`/firms/${firmId}`);
    return data;
};

export const updateFirm = async (firmId, formData) => {
    const { data } = await api.put(`/firms/edit/${firmId}`, formData);
    return data;
};

export const deleteFirm = async (firmId) => {
    const { data } = await api.delete(`/firms/delete/${firmId}`);
    return data;
};
