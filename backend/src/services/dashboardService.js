import User from "../models/User.js";
import ObjectModel from "../models/Object.js";
import Firm from "../models/Firm.js";
import Employee from "../models/Employee.js";
import FoodLog from "../models/logs/FoodLog.js";
import HygieneLog from "../models/logs/HygieneLog.js";
import PersonalHygieneLog from "../models/logs/PersonalHygieneLog.js";
import FridgeTemperatureLog from "../models/logs/FridgeTemperatureLog.js";
import FryerOilLog from "../models/logs/FryerOilLog.js";
import CookingTempLog from "../models/logs/CookingTempLog.js";
import ProducedFood from "../models/logs/ProducedFood.js";
import ShipmentLog from "../models/logs/ShipmentLog.js";

const countDiaries = async (objectIds) => {
    const models = [
        FoodLog, HygieneLog, PersonalHygieneLog, FridgeTemperatureLog,
        FryerOilLog, CookingTempLog, ProducedFood, ShipmentLog
    ];
    let count = 0;
    for (const Model of models) {
        try {
            const exists = await Model.exists({ object_id: { $in: objectIds } });
            if (exists) count++;
        } catch {}
    }
    return count;
};

const getDashboardInfo = async (userId, role) => {
    const user = await User.findById(userId).populate("firm_id object_id");
    if (!user) throw new Error("User not found");

    if (role === "admin") {
        const firms = await Firm.find({});
        const objects = await ObjectModel.find({}).populate("firm_id mol_user_id");
        const users = await User.find({}).select("-password_hash");
        return {
            user: { username: user.username, role: user.role },
            firms,
            objects,
            users,
            alerts: {}
        };
    }

    let objects = [];
    if (role === "owner") {
        objects = await ObjectModel.find({ firm_id: user.firm_id });
    }
    if (role === "manager") {
        if (!user.object_id) throw new Error("Manager has no assigned object.");
        objects = await ObjectModel.find({ _id: user.object_id });
    }

    let employeesExpired = [];
    let employeesExpiringSoon = [];
    let totalEmployees = 0;
    let activeDiaries = 0;

    if (objects.length > 0) {
        const objectIds = objects.map(obj => obj._id);

        const employees = await Employee.find({ object_id: { $in: objectIds }, active: { $ne: false } });
        totalEmployees = employees.length;

        const now = new Date();
        const in30Days = new Date();
        in30Days.setDate(now.getDate() + 30);

        employees.forEach(emp => {
            if (!emp.health_card_expiry) return;
            if (emp.health_card_expiry < now) {
                employeesExpired.push(emp);
            } else if (emp.health_card_expiry <= in30Days) {
                employeesExpiringSoon.push(emp);
            }
        });

        activeDiaries = await countDiaries(objectIds);
    }

    return {
        user: {
            username: user.username,
            role: user.role,
            firm: role === "owner" ? user.firm_id : undefined,
        },
        objects,
        totalEmployees,
        activeDiaries,
        alerts: {
            employeesExpiringSoon,
            employeesExpired,
        }
    };
};

export default {
    getDashboardInfo,
};