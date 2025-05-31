import Tech from "../../models/Tech.js";
import Unit from "../../models/Unit.js";
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestUnits() {

    try {
        console.log("ingesting units")
        const unitsUrl = buildUrl("units", "units");
        const unitsList = await fetchJson(unitsUrl);

        for (const data of unitsList) {

            const unitDoc = {
                name: data.name,
                icon: data.icon,
                info: data?.game_info || null,
                strategy: data?.strategy || null,
                prereqTech: data.prereq_tech?.name || null, 
            };

            // always fill info first if only one field is available
            if(data.game_info == null && data.strategy == null) {
               if(unitDoc.prereqTech) {
                const tech = await Tech.findOne({name: unitDoc.prereqTech});
                unitDoc.info = data.name + " is a basic unit available in the " + tech.era + ".";
               } else {
                unitDoc.info = data.name + " is a basic unit available in the Ancient Era.";
               }
               
            }
            else if (data.game_info == null && data.strategy != null){
               unitDoc.info = unitDoc.strategy;
               unitDoc.strategy = null;
            }

            await Unit.updateOne({"name": unitDoc.name}, {$set: unitDoc}, {upsert: true});
            //console.log(`ingested ${unitDoc.info}`)
        }

        // specialists
        const specialistsUrl = buildUrl("specialists", "specialists");
        const specialistsList = await fetchJson(specialistsUrl);

        for(const data of specialistsList) {

            const unitDoc = {
                name: data.name,
                icon: data.icon,
                info: data?.game_info || null,
                strategy: data?.strategy || null,
                prereqTech: data.prereq_tech?.name || null, 
            };

            // always fill info first if only one field is available
            if(data.game_info == null && data.strategy == null) {
               if(unitDoc.prereqTech) {
                const tech = await Tech.findOne({name: unitDoc.prereqTech});
                unitDoc.info = data.name + " is a basic unit available in the " + tech.era + ".";
               } else {
                unitDoc.info = data.name + " is a basic unit available in the Ancient Era.";
               } 
            }
            else if (data.game_info == null && data.strategy != null){
               unitDoc.info = unitDoc.strategy;
               unitDoc.strategy = null;
            }

            await Unit.updateOne({"name": unitDoc.name}, {$set: unitDoc}, {upsert: true});
        }

    } catch (err) {
        console.error("error in ingestUnits: ", err);
    }
}
