import Firm from "../models/Firm.js";

const getAllFirms = async () => {
    return await Firm.find().sort({ created_at: -1 });
};

const getFirmById = async (firmId) => {
    const firm = await Firm.findById(firmId);
    if (!firm) throw new Error("Firm not found");
    return firm;
};

const updateFirm = async (firmId, updateData) => {
    const firm = await Firm.findByIdAndUpdate(
        firmId,
        updateData,
        { new: true }
    );

    if (!firm) throw new Error("Firm not found");
    return firm;
};

const deleteFirm = async (firmId) => {
    const firm = await Firm.findByIdAndDelete(firmId);
    if (!firm) throw new Error("Firm not found");
    return true;
};

export default {
    getAllFirms,
    getFirmById,
    updateFirm,
    deleteFirm,
};
