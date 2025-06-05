import Tech from "../../models/Tech.js";
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestTechs() {

    try {
        console.log("ingesting techs")
        const techsUrl = buildUrl("tech", "technologies");
        const techsList = await fetchJson(techsUrl);

        for (const data of techsList) {

            const techDoc = {
                name: data.name,
                icon: data.icon,
                era: data.era,
                prereqTechs: data.tech_prereqs.map(tech => tech.name),
                techUnlocks: data.tech_unlocks.map(unlock => unlock.name),
                unitUnlocks: data.unit_unlocks.map(unlock => unlock.name),
                buildingUnlocks: data.building_unlocks.map(unlock => unlock.name),
            };

            await Tech.updateOne({ "name": techDoc.name }, { $set: techDoc }, { upsert: true });
            //console.log(`ingested ${techDoc.name}`)
        }

    } catch (err) {
        console.error("error in ingestTechs: ", err);
    }
}
