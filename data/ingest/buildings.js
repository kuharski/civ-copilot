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

            await Building.updateOne({"name": buildingDoc.name}, {$set: buildingDoc}, {upsert: true});
            console.log(`ingested ${buildingDoc.name}`)
        }

    } catch (err) {
        console.error("error in ingestBuildings: ", err);
    }
}
