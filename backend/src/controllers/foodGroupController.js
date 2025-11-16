import foodGroupService from "../services/foodGroupService.js";
import ObjectModel from "../models/Object.js";

const createFoodGroup = async (req, res) => {
    try {
        const { objectId } = req.params;
        const { food_name, food_type, cooking_temp, shelf_life } = req.body;

        if (req.isManager && req.user.object_id !== objectId) {
            return res.status(403).json({ message: "Not authorized to add food group to this object" });
        }

        if (req.isOwner) {
            const object = await ObjectModel.findById(objectId);
            if (object.firm_id.toString() !== req.user.firm_id) {
                return res.status(403).json({ message: "Not authorized to add food group for another firm's object" });
            }
        }

        const newFoodGroup = await foodGroupService.createFoodGroup({
            object_id: objectId,
            food_name,
            food_type,
            cooking_temp,
            shelf_life,
        });

        res.status(201).json(newFoodGroup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFoodGroupsByObject = async (req, res) => {
    try {
        const { objectId } = req.params;

        if (req.isManager && req.user.object_id !== objectId) {
            return res.status(403).json({ message: "Not authorized to view this object" });
        }

        if (req.isOwner) {
            const object = await ObjectModel.findById(objectId);
            if (object.firm_id.toString() !== req.user.firm_id) {
                return res.status(403).json({ message: "Not authorized to view this firm's object" });
            }
        }

        const foodGroups = await foodGroupService.getFoodGroupsByObject(objectId);
        res.status(200).json(foodGroups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateFoodGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const updatedFoodGroup = await foodGroupService.updateFoodGroup(groupId, req.body);
        res.status(200).json(updatedFoodGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteFoodGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        await foodGroupService.deleteFoodGroup(groupId);
        res.status(200).json({ message: "Food group deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export default {
    createFoodGroup,
    getFoodGroupsByObject,
    updateFoodGroup,
    deleteFoodGroup,
};
