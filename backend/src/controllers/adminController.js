import userService from "../services/userService.js";

const getInactiveUsers = async (req, res) => {
    try {
        const users = await userService.getInactiveUsers();
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getInactiveFirms = async (req, res) => {
    try {
        const firms = await userService.getInactiveFirms();
        res.json(firms);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const activateUser = async (req, res) => {
    try {
        const result = await userService.activateUser(req.params.userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const activateFirm = async (req, res) => {
    try {
        const result = await userService.activateFirm(req.params.firmId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    getInactiveUsers,
    getInactiveFirms,
    activateUser,
    activateFirm,
};