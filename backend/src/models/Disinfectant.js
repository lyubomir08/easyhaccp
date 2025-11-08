import mongoose from "mongoose";

const disinfectantSchema = new mongoose.Schema({
    object_id: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
    name: { type: String, required: true, trim: true }
}, { versionKey: false });

export default mongoose.model("Disinfectant", disinfectantSchema);