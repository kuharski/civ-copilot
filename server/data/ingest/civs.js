import Civilization from "../../models/Civilization.js";
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

function deduplicateHistory(entries = []) {
    const seen = new Set();
    return entries.filter(entry => {
        const key = `${entry.heading}:${entry.text}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export default async function ingestCivs() {

    try {
        console.log("ingesting civilizations")
        const civsUrl = buildUrl("civilizations", "civilizations");
        const civList = await fetchJson(civsUrl);

        for (const civData of civList) {

            const civSlug = civData.name.toLowerCase().trim().split(" ").pop();

            const civDoc = {
                civ: {
                    name: civData.name,
                    slug: civSlug,
                    icon: civData.icon,
                    uniqueUnits: civData.unique_units.map(unit => unit.name),
                    uniqueBuildings: civData.unique_buildings.map(building => building.name),
                    historicalInfo: deduplicateHistory(civData.historical_info)
                },
                leader: {
                    name: civData.leader.name,
                    subtitle: civData.leader.subtitle,
                    lived: civData.leader.lived,
                    icon: civData.leader.icon,
                    leaderTrait: {
                        name: civData.leader.trait.name,
                        effect: civData.leader.trait.effect
                    }
                },
                strategy: {
                    primaryVictory: null,
                    secondaryVictory: null,
                    general: null,
                    counter: null
                }
            };

            await Civilization.updateOne({ "civ.name": civDoc.civ.name }, { $set: civDoc }, { upsert: true });
            console.log(`ingested ${civDoc.civ.name}`)
        }

    } catch (err) {
        console.error("error in ingestCivs: ", err);
    }
}
