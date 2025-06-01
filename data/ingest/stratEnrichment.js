import dotenv from "dotenv";
dotenv.config();
import Civilization from "../../models/Civilization.js";
import Unit from "../../models/Unit.js";
import Building from "../../models/Building.js"

import OpenAI from "openai";
const client = new OpenAI(
    base_url = "https://api.fireworks.ai/inference/v1",
    api_key = process.env.AI_API_KEY,
);

export default async function enrichStrats() {

    try {
        const allCivs = await Civilization.find({});

        for (const doc of allCivs) {
            console.log("Name: " + doc.civ.name);
            for (const unit of doc.civ.uniqueUnits) {
                const unitObj = await Unit.findOne({ name: unit });
                if (unitObj) {
                    console.log(unit + " : " + unitObj.info);
                }
            }
            for (const building of doc.civ.uniqueBuildings) {
                const buildingObj = await Building.findOne({ name: building });
                if (buildingObj) {
                    console.log(building + " : " + buildingObj.info);
                }
            }
            console.log("Trait : " + doc.leader.leaderTrait.effect);
            console.log(" ");
        }

    } catch (err) {
        console.error("error in enrichStrats: ", err);
    }
}
