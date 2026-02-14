import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ username: "admin" });

  if (!admin) {
    console.log("❌ ADMIN НЕ СЪЩЕСТВУВА");
  } else {
    console.log("✅ ADMIN СЪЩЕСТВУВА:");
    console.log({
      id: admin._id.toString(),
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active
    });
  }

  process.exit();
}

check();

