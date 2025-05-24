import Wonder from "../../models/Wonder.js"
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestWonders() {

    try {
        console.log("ingesting wonders")
        const wondersUrl = buildUrl("wonders", "wonders");
        const wondersList = await fetchJson(wondersUrl);

        for (const data of wondersList) {

            const wonderDoc = {
                name: data.name,
                icon: data.icon,
                info: data.game_info,
                strategy: data?.strategy || null,
                prereqTech: data.tech_prereq?.name || null,
                yields: {
                    gold: data.yields?.gold ?? null,
                    production: data.yields?.production ?? null,
                    science: data.yields?.science ?? null,
                    culture: data.yields?.culture ?? null,
                    food: data.yields?.food ?? null,
                    faith: data.yields?.faith ?? null,
                    happiness: data.yields?.happiness ?? null
                }    
            };

            await Wonder.updateOne({"name": wonderDoc.name}, {$set: wonderDoc}, {upsert: true});
            console.log(`ingested ${wonderDoc.name}`)
        }

    } catch (err) {
        console.error("error in ingestWonders: ", err);
    }
}
