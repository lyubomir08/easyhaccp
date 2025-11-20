import contractorService from "../services/contractorService.js";

const createClient = async (req, res) => {
    try {
        const contractor = await contractorService.createContractor(req.body);
        res.status(201).json(contractor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getClient = async (req, res) => {
    try {
        const list = await contractorService.getContractors();
        res.status(200).json(list);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { contractorId } = req.params;

        const updated = await contractorService.updateContractor(contractorId, req.body);
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { contractorId } = req.params;

        await contractorService.deleteContractor(contractorId);
        res.status(200).json({ message: "Contractor deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createClient,
    getClient,
    updateClient,
    deleteClient,
};
