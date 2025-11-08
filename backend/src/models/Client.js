import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    firm_id: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String },
    registration_number: { type: String, trim: true }
}, { versionKey: false });

export default mongoose.model("Client", clientSchema);