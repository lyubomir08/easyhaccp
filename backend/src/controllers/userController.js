import userService from "../services/userService.js";

const register = async (req, res) => {
    try {
        const formData = req.body;

        const newFirmData = await userService.registerFirmRequest(formData);

        res.status(201).json({
            message: "Registration request submitted successfully.",
            firmId: newFirmData.firmId,
            userId: newFirmData.userId
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await userService.loginUser(username, password);
        res.status(200).json(userData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: "Logout successful. Remove token from client storage." });
};

export default {
    register,
    login,
    logout
};