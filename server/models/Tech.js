import mongoose from "mongoose";

const TechSchema = new mongoose.Schema ({
    name: String,
    icon: String,
    era: String,
    cost: String,
    prereqTechs: [String],
    techUnlocks: [String],
    unitUnlocks: [{
        name: String,
        info: String
    }],
    buildingUnlocks: [{
        name: String,
        info: String
    }]
});

export default mongoose.model("Tech", TechSchema, "techs");
