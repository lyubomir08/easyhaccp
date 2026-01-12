import firmService from "../services/firmService.js";

const getAllFirms = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }

        const firms = await firmService.getAllFirms();
        res.status(200).json(firms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyFirm = async (req, res) => {
    try {
        if (!req.isOwner) {
            return res.status(403).json({ message: "Owners only" });
        }

        const firm = await firmService.getFirmById(req.user.firm_id);
        res.status(200).json(firm);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const getFirmById = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }

        const firm = await firmService.getFirmById(req.params.firmId);
        res.status(200).json(firm);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const updateFirm = async (req, res) => {
    try {
        const firm = await firmService.getFirmById(req.params.firmId);

        if (req.isManager) {
            return res.status(403).json({ message: "Managers cannot edit firms" });
        }

        if (req.isOwner && firm._id.toString() !== req.user.firm_id) {
            return res.status(403).json({ message: "You can edit only your firm" });
        }

        const updatedFirm = await firmService.updateFirm(
            req.params.firmId,
            req.body
        );

        res.status(200).json(updatedFirm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFirm = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }

        await firmService.deleteFirm(req.params.firmId);
        res.status(200).json({ message: "Firm deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export default {
    getAllFirms,
    getMyFirm,
    getFirmById,
    updateFirm,
    deleteFirm,
};
