import Firm from "../models/Firm.js";
import ObjectModel from "../models/Object.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";

const registerFirmRequest = async (formData) => {
    const {
        bulstat,
        companyName,
        ownerFirstName,
        ownerLastName,
        phone,
        email,
        username,
        password,
        objects = []
    } = formData;

    const existingFirm = await Firm.findOne({ bulstat });
    if (existingFirm) throw new Error("Фирма с този Булстат вече съществува.");

    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error("Потребител с това потребителско име вече съществува.");

    const firmData = {
        bulstat,
        vat_registered: false,
        name: companyName,
        mol: `${ownerFirstName || ""} ${ownerLastName || ""}`.trim(),
        phone,
        email,
    };

    const newFirm = await Firm.create(firmData);

    const hashedOwnerPass = await bcrypt.hash(password, 10);

    await User.create({
        username,
        email,
        role: "owner",
        firm_id: newFirm._id,
        password_hash: hashedOwnerPass,
        active: false,
    });

    for (const obj of objects) {
        const newObject = await ObjectModel.create({
            firm_id: newFirm._id,
            name: obj.name,
            address: obj.address,
            working_hours: obj.workingHours,
            object_type: obj.type,
        });

        if (obj.molUsername && obj.molPassword) {
            const hashedMolPass = await bcrypt.hash(obj.molPassword, 10);

            const molUser = await User.create({
                username: obj.molUsername,
                email: obj.molEmail,
                role: "manager",
                firm_id: newFirm._id,
                object_id: newObject._id,
                password_hash: hashedMolPass,
                active: false
            });

            newObject.mol_user_id = molUser._id;
            await newObject.save();
        }

    }

    return {
        message: "Registration request submitted. Waiting for admin approval.",
        firmId: newFirm._id,
    };
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Invalid username or password.");

    if (!user.active) throw new Error("Your account is not approved yet.");

    if (user.firm_id) {
        const firm = await Firm.findById(user.firm_id);

        if (!firm || !firm.active) {
            throw new Error("Firm is not approved yet.");
        }
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid username or password.");

    const token = await jwt.sign(
        {
            userId: user._id,
            username: user.username,
            role: user.role,
            firm_id: user.firm_id,
            object_id: user.object_id,
            active: user.active
        },
        process.env.JWT_SECRET,
        { expiresIn: "4d" }
    );

    return { ...user.toJSON(), token };
};

const changePassword = async (userId, oldPass, newPass) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    if (!user.active) throw new Error("Account not active.");

    const validOld = await bcrypt.compare(oldPass, user.password_hash);
    if (!validOld) throw new Error("Old password is incorrect.");

    const hashed = await bcrypt.hash(newPass, 10);

    user.password_hash = hashed;
    await user.save();

    return { message: "Password changed successfully." };
};

const getInactiveUsers = async () => {
    return User.find({ active: false })
        .populate("firm_id", "name bulstat")
        .select("_id username role firm_id created_at")
        .sort({ created_at: 1 });
};

const getInactiveFirms = async () => {
    return Firm.find({ active: false })
        .select("_id name bulstat created_at")
        .sort({ created_at: 1 });
};

const activateUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.active = true;
    await user.save();

    return { message: `User ${user.username} activated` };
};

const activateFirm = async (firmId) => {
    const firm = await Firm.findById(firmId);
    if (!firm) throw new Error("Firm not found");

    firm.active = true;
    await firm.save();

    return { message: `Firm ${firm.name} activated` };
};

const getAllUsers = async () => {
    return User.find()
        .populate("firm_id", "name")
        .populate("object_id", "name")
        .select("-password_hash")
        .sort({ created_at: -1 });
};

const getUsersByFirm = async (firmId) => {
    return User.find({ firm_id: firmId })
        .populate("object_id", "name")
        .select("-password_hash")
        .sort({ created_at: -1 });
};

const getUserById = async (userId) => {
    const user = await User.findById(userId)
        .populate("firm_id", "name")
        .populate("object_id", "name")
        .select("-password_hash");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const updateUser = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    )
        .populate("firm_id", "name")
        .populate("object_id", "name")
        .select("-password_hash");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return true;
};

const updateProfile = async (userId, updateData) => {
    const allowedFields = ["email"];
    const filteredData = {};

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            filteredData[key] = updateData[key];
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        filteredData,
        { new: true }
    ).select("-password_hash");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export default {
    registerFirmRequest,
    loginUser,
    changePassword,
    activateUser,
    getInactiveUsers,
    getInactiveFirms,
    activateFirm,
    getAllUsers,
    getUsersByFirm,
    getUserById,
    updateUser,
    deleteUser,
    updateProfile
};