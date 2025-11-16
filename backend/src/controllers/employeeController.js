import employeeService from "../services/employeeService.js";
import ObjectModel from "../models/Object.js";

const getEmployees = async (req, res) => {
    try {
        const { objectId } = req.params;
        const { role, objectId: userObjectId, firmId: userFirmId } = req.user;

        const object = await ObjectModel.findById(objectId);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (role === "manager" && String(objectId) !== String(userObjectId)) {
            return res.status(403).json({ message: "Access denied. Not your object." });
        }

        if (role === "owner" && String(object.firm_id) !== String(userFirmId)) {
            return res.status(403).json({ message: "Access denied. Not your firm's object." });
        }

        const employees = await employeeService.getEmployeesByObject(objectId);
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        const { role, objectId: userObjectId, firmId: userFirmId } = req.user;

        const object = await ObjectModel.findById(employeeData.object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (role === "manager" && String(employeeData.object_id) !== String(userObjectId)) {
            return res.status(403).json({ message: "Access denied. Not your object." });
        }

        if (role === "owner" && String(object.firm_id) !== String(userFirmId)) {
            return res.status(403).json({ message: "Access denied. Not your firm's object." });
        }

        const newEmployee = await employeeService.createEmployee(employeeData);
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const editEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const updatedData = req.body;
        const { role, objectId: userObjectId, firmId: userFirmId } = req.user;

        const employee = await employeeService.getEmployeesById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const object = await ObjectModel.findById(employee.object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (role === "manager" && String(employee.object_id) !== String(userObjectId)) {
            return res.status(403).json({ message: "Access denied. Not your object." });
        }

        if (role === "owner" && String(object.firm_id) !== String(userFirmId)) {
            return res.status(403).json({ message: "Access denied. Not your firm's object." });
        }

        const updatedEmployee = await employeeService.updateEmployee(employeeId, updatedData);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { role, objectId: userObjectId, firmId: userFirmId } = req.user;

        const employee = await employeeService.getEmployeesById(employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const object = await ObjectModel.findById(employee.object_id);
        if (!object) return res.status(404).json({ message: "Object not found" });

        if (role === "manager" && String(employee.object_id) !== String(userObjectId)) {
            return res.status(403).json({ message: "Access denied. Not your object." });
        }

        if (role === "owner" && String(object.firm_id) !== String(userFirmId)) {
            return res.status(403).json({ message: "Access denied. Not your firm's object." });
        }

        const removedEmployee = await employeeService.deleteEmployee(employeeId);
        res.status(200).json(removedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    getEmployees,
    addEmployee,
    editEmployee,
    removeEmployee
};
