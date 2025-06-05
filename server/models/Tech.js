import mongoose from "mongoose";

const TechSchema = new mongoose.Schema ({
    name: String,
    icon: String,
    era: String,
    prereqTechs: [String],
    techUnlocks: [String],
    unitUnlocks: [String],
    buildingUnlocks: [String]
});

export default mongoose.model("Tech", TechSchema, "techs");
