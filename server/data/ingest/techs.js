import Tech from "../../models/Tech.js";
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestTechs() {

    try {
        console.log("ingesting techs")
        const techsUrl = buildUrl("tech", "technologies");
        const techsList = await fetchJson(techsUrl);

        for (const data of techsList) {

            const unitUnlocks = await Promise.all(
                data.unit_unlocks.map(async (unlock) => {
                    try {
                        const unit = await fetchJson(unlock.url);
                        console.log(unit.game_info);
                        return {
                            name: unlock.name,
                            info: unit.game_info
                        };
                    } catch (err) {
                        return {
                            name: unlock.name,
                            info: "null"
                        };
                    }
                })
            );

            const buildingUnlocks = await Promise.all(
                data.building_unlocks.map(async (unlock) => {
                    try {
                        const building = await fetchJson(unlock.url);
                        console.log(building.game_info);
                        return {
                            name: unlock.name,
                            info: building.game_info
                        }
                    } catch (err) {
                        return {
                            name: unlock.name,
                            info: "null"
                        }
                    }
                })
            );

            const techDoc = {
                name: data.name,
                icon: data.icon,
                era: data.era,
                cost: data.cost,
                prereqTechs: data.tech_prereqs.map(tech => tech.name),
                techUnlocks: data.tech_unlocks.map(unlock => unlock.name),
                unitUnlocks: unitUnlocks,
                buildingUnlocks: buildingUnlocks
            };

            await Tech.updateOne({ "name": techDoc.name }, { $set: techDoc }, { upsert: true });
            console.log(`ingested ${techDoc.name}`)
        }

    } catch (err) {
        console.error("error in ingestTechs: ", err);
    }
}
