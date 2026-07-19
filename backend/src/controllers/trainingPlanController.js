import * as trainingPlanService from "../services/trainingPlanService.js";

const createPlan = async (req, res) => {
    try {
        const plan = await trainingPlanService.createPlan(req.body);
        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getPlans = async (req, res) => {
    try {
        const plans = await trainingPlanService.getPlans();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPlanById = async (req, res) => {
    try {
        const plan = await trainingPlanService.getPlanById(req.params.planId);

        if (!plan) {
            return res.status(404).json({ message: "Планът не е намерен." });
        }

        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updatePlan = async (req, res) => {
    try {
        const plan = await trainingPlanService.updatePlan(
            req.params.planId,
            req.body
        );

        res.json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deletePlan = async (req, res) => {
    try {
        await trainingPlanService.deletePlan(req.params.planId);
        res.json({ message: "Планът е изтрит." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const trainingPlanController = {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan,
};

export default trainingPlanController;