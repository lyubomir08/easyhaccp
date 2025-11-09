import jwt from "../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated. Missing token." });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        req.isAdmin = decoded.role === "admin";
        req.isOwner = decoded.role === "owner";
        req.isManager = decoded.role === "manager";

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        } else {
            return res.status(500).json({ message: "Authentication error" });
        }
    }
};

export default authMiddleware;
