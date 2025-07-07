import techGraph from "./techGraph.js";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.fireworks.ai/inference/v1"
});

export async function weightAssignment(candidates, leader, strategy) {
    try {
        const sysPrompt = `
            assign weights
        `;
        const message = [
        `Civilization: ${doc.civ.name}`,
        units.length ? `Unique Unit(s):\n${units.join("\n")}` : "",
        buildings.length ? `Unique Building(s):\n${buildings.join("\n")}` : "",
        `Leader Trait, ${doc.leader.leaderTrait.name}: ${doc.leader.leaderTrait.effect}`,
        `Please generate:`,
        `- A primary and secondary victory condition (must be different) from: Domination, Science, Diplomatic, Cultural`,
        `- A general strategy for playing this civilization`,
        `- A counter-strategy for facing this civilization`
        ].join("\n");

    } catch (err) {
        console.error("error in weight assignment: ", err);
    }
}   

export function costCap(cost){

    if(0 <= cost <= 55) { //ancient
        return 175;
    } else if(55 < cost <= 175) { //classical
        return 485;
    } else if(175 < cost <= 485) { //medieval
        return 1150;
    } else if(485 < cost <= 1150) { // renaissance
        return 2350;
    } else if(1150 < cost <= 2350) { // industrial
        return 4100;
    } else if(2350 < cost <= 4100) { // modern
        return 6400;
    } else if(4100 < cost <= 6400) { // atomic
        return 10000;
    } else {
        return 10000;
    }
}
