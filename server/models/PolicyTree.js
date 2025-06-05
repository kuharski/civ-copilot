import mongoose from "mongoose";

const PolicyTreeSchema = new mongoose.Schema({
    name: String,
    info: String,
    prereqEra: String,
    icon: String,
    isIdeology: Boolean
});

export default mongoose.model("PolicyTree", PolicyTreeSchema);
