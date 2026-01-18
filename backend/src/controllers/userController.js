import userService from "../services/userService.js";

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await userService.updateProfile(userId, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        if (req.isAdmin) {
            const users = await userService.getAllUsers();
            return res.json(users);
        }

        if (req.isOwner) {
            const users = await userService.getUsersByFirm(req.user.firm_id);
            return res.json(users);
        }

        return res.status(403).json({ message: "Access denied" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);

        if (req.isOwner) {
            if (
                user.firm_id?._id.toString() !== req.user.firm_id
            ) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        if (!req.isAdmin && !req.isOwner) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);

        if (req.isManager) {
            return res.status(403).json({ message: "Managers cannot manage users" });
        }

        if (req.isOwner) {
            if (
                user.role !== "manager" ||
                user.firm_id?._id.toString() !== req.user.firm_id
            ) {
                return res.status(403).json({
                    message: "Owners can edit only managers in their firm",
                });
            }
        }

        const updatedUser = await userService.updateUser(
            req.params.userId,
            req.body
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }

        await userService.deleteUser(req.params.userId);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

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

const getManagers = async (req, res) => {
    try {
        if (req.isManager) {
            return res.status(403).json({ message: "Access denied" });
        }

        const managers = await userService.getManagers({
            firmId: req.user.firm_id,
            isAdmin: req.isAdmin
        });

        res.json(managers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default { register, login, logout, changePassword, getUsers, getUserById, updateUser, deleteUser, updateProfile, getManagers };
