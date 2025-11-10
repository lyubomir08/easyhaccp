import Firm from "../models/Firm.js";
import ObjectModel from "../models/Object.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const registerFirmRequest = async (formData) => {
    const {
        bulstat,
        companyName,
        ownerFirstName,
        ownerLastName,
        phone,
        email,
        username,
        objects = []
    } = formData;

    const firmData = {
        bulstat,
        vat_registered: false,
        name: companyName,
        mol: `${ownerFirstName || ""} ${ownerLastName || ""}`.trim(),
        phone,
        email,
    };

    const existingFirm = await Firm.findOne({ bulstat });
    if (existingFirm) throw new Error("Фирма с този Булстат вече съществува.");

    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error("Потребител с това потребителско име вече съществува.");

    const newFirm = await Firm.create(firmData);

    const createdObjects = [];
    for (const obj of objects) {
        const newObject = await ObjectModel.create({
            firm_id: newFirm._id,
            name: obj.name,
            address: obj.address,
            working_hours: obj.workingHours,
            object_type: obj.type,
        });
        createdObjects.push(newObject);
    }

    const newUser = await User.create({
        username,
        email,
        role: "owner",
        firm_id: newFirm._id,
    });

    return {
        message: "Registration request submitted successfully.",
        firmId: newFirm._id,
        userId: newUser._id,
    };
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Invalid username or password.");

    if (!user.password_hash)
        throw new Error("Your account is not activated yet. Please wait for email confirmation.");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Invalid username or password.");

    const token = await jwt.sign(
        {
            userId: user._id,
            username: user.username,
            role: user.role,
            firmId: user.firm_id,
            objectId: user.object_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "4d" }
    );

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id,
        object_id: user.object_id,
        token,
    };
};

export default {
    registerFirmRequest,
    loginUser,
};