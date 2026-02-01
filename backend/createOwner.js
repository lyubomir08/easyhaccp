import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const passwordHash = await bcrypt.hash("Owner123456", 10);

        const owner = await User.create({
            username: "owner",
            name: "Owner User",
            email: "owner@gmail.com",
            role: "owner",
            password_hash: passwordHash,
            active: true
        });

        console.log("✅ OWNER СЪЗДАДЕН:");
        console.log({
            id: owner._id.toString(),
            username: owner.username,
            email: owner.email,
            role: owner.role,
            active: owner.active
        });

        process.exit(0);
    } catch (err) {
        console.error("❌ ГРЕШКА:");
        console.error(err.message);
        process.exit(1);
    }
}

run();

