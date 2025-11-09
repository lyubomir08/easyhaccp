import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import firmRoutes from "./routes/firmRoutes.js";
// import objectRoutes from "./routes/objectRoutes.js";

// import authMiddleware from "./middlewares/authMiddleware.js";

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
app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/firms", firmRoutes);
// app.use("/api/objects", objectRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();