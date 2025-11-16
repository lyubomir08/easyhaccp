import Employee from "../models/Employee.js";

const getEmployeesByObject = async (objectId) => {
    return await Employee.find({ object_id: objectId, active: true });
};

const createEmployee = async (data) => {
    return await Employee.create(data);
};

const updateEmployee = async (employeeId, updatedData) => {
    return await Employee.findByIdAndUpdate(employeeId, updatedData, { new: true });
};

const deleteEmployee = async (employeeId) => {
    return await Employee.findByIdAndUpdate(employeeId, { active: false }, { new: true });
};

export default {
    getEmployeesByObject,
    createEmployee,
    updateEmployee,
    deleteEmployee
};