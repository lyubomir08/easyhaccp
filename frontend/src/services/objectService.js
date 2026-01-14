import api from "./api";

export const getObjects = async () => {
    const { data } = await api.get("/objects");
    return data;
};

export const getObjectById = async (objectId) => {
    const { data } = await api.get(`/objects/${objectId}`);
    return data;
};

export const createObject = async (formData) => {
    const { data } = await api.post("/objects/create", formData);
    return data;
};

export const updateObject = async (objectId, formData) => {
    const { data } = await api.put(`/objects/edit/${objectId}`, formData);
    return data;
};

export const deleteObject = async (objectId) => {
    const { data } = await api.delete(`/objects/delete/${objectId}`);
    return data;
};
