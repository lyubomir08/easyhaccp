import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const password = await bcrypt.hash("Admin654123", 10);

await User.create({
    username: "admin",
    email: "admin@gmail.com",
    role: "admin",
    password_hash: password,
    active: true
});

console.log("Admin created");
process.exit();