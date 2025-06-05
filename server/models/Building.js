import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema({
    name: String,
    icon: String,
    info: String,
    strategy: String,
    prereqTech: String,
    yields: {
        gold: Number,
        production: Number,
        science: Number,
        culture: Number,
        food: Number,
        faith: Number,
        happiness: Number
    }
});

export default mongoose.model("Building", BuildingSchema);
