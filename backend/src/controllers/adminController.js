import userService from "../services/userService.js";

const activateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await userService.activateUser(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getInactiveUsers = async (req, res) => {
    try {
        const users = await userService.getInactiveUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const activateFirm = async (req, res) => {
    try {
        const { firmId } = req.params;
        const result = await userService.activateFirm(firmId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default { activateUser, getInactiveUsers, activateFirm };