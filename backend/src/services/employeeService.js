import Employee from "../models/Employee.js";

const getEmployeesByObject = async (objectId) => {
    return await Employee.find({ object_id: objectId, active: true });
};

const getEmployeesById = async (employeeId) => {
    return await Employee.findById(employeeId);
};

const createEmployee = async (data) => {
    return await Employee.create(data);
};

const updateEmployee = async (employeeId, updatedData) => {
    return await Employee.findByIdAndUpdate(
        employeeId,
        updatedData,
        { new: true }
    );
};

const deleteEmployee = async (employeeId) => {
    return await Employee.findByIdAndUpdate(
        employeeId,
        { active: false },
        { new: true }
    );
};

export default {
    getEmployeesByObject,
    getEmployeesById,     
    createEmployee,
    updateEmployee,
    deleteEmployee
};
