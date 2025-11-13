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

export default { activateUser };