import Tech from "../../models/Tech.js";
import Building from "../../models/Building.js"
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestBuildings() {

    try {
        console.log("ingesting buildings")
        const buildingsUrl = buildUrl("buildings", "buildings");
        const buildingsList = await fetchJson(buildingsUrl);

        for (const data of buildingsList) {

            const buildingDoc = {
                name: data.name,
                icon: data.icon,
                info: data?.game_info || null,
                strategy: data.strategy,
                prereqTech: data.prereq_tech?.name || null,
                yields: {
                    gold: data.yields.gold,
                    production: data.yields.production,
                    science: data.yields.science,
                    culture: data.yields.culture,
                    food: data.yields.food,
                    faith: data.yields.faith,
                    happiness: data.yields.happiness
                }
            };

            // always fill info first if only one field is available
            if (data.game_info == null && data.strategy == null) {
                if (buildingDoc.prereqTech) {
                    const tech = await Tech.findOne({ name: buildingDoc.prereqTech });
                    buildingDoc.info = data.name + " is a basic building available in the " + tech.era + ".";
                } else {
                    buildingDoc.info = data.name + " is a basic building available in the Ancient Era.";
                }

            }
            else if (data.game_info == null && data.strategy != null) {
                buildingDoc.info = buildingDoc.strategy;
                buildingDoc.strategy = null;
            }

            await Building.updateOne({ "name": buildingDoc.name }, { $set: buildingDoc }, { upsert: true });
            //console.log(`ingested ${buildingDoc.info}`)
        }

    } catch (err) {
        console.error("error in ingestBuildings: ", err);
    }
}
