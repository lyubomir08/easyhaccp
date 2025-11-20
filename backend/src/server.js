import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import employeeRoutes from "./routes/employeeRoutes.js";
import foodGroupRoutes from "./routes/foodGroupRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import fridgeRoutes from "./routes/fridgeRoutes.js";
import fryerRoutes from "./routes/fryerRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import disinfectantRoutes from "./routes/disinfectantRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "https://lyubomir08.github.io",
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/employees", employeeRoutes);
app.use("/api/food-groups", foodGroupRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/fridges", fridgeRoutes);
app.use("/api/fryers", fryerRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/disinfectants", disinfectantRoutes);
app.use("/api/clients", clientRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();