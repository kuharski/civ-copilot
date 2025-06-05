import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    name: String,
    icon: String,
    info: String,
    strategy: String,
    prereqTech: String,
});

export default mongoose.model("Unit", UnitSchema);
