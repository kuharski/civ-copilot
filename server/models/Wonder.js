import mongoose from "mongoose";

const WonderSchema = new mongoose.Schema({
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

export default mongoose.model("Wonder", WonderSchema);
