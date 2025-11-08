import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String },
    email: { type: String, trim: true },
    role: { type: String, enum: ["owner", "manager", "admin"], default: "owner" },
    firm_id: { type: mongoose.Schema.Types.ObjectId, ref: "Firm" },
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object" },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
}, { versionKey: false });

userSchema.index({ firm_id: 1 });

export default mongoose.model("User", userSchema);
