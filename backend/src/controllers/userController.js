import userService from "../services/userService.js";

const register = async (req, res) => {
    try {
        const result = await userService.registerFirmRequest(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await userService.loginUser(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: "Logout successful. Remove token from client storage." });
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        const result = await userService.changePassword(userId, oldPassword, newPassword);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default { register, login, logout, changePassword };
