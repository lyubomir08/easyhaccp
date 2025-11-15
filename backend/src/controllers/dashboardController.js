import dashboardService from "../services/dashboardService.js";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        const data = await dashboardService.getDashboardInfo(userId, role);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getDashboardData,
};
