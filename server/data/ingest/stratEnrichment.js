import dotenv from "dotenv";
dotenv.config();
import Civilization from "../../models/Civilization.js";
import Unit from "../../models/Unit.js";
import Building from "../../models/Building.js"

import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.fireworks.ai/inference/v1"
});

export default async function enrichStrats() {

    try {
        const allCivs = await Civilization.find({ "strategy.primaryVictory": null });

        for (const doc of allCivs) {

            const units = [];
            for (const unit of doc.civ.uniqueUnits) {
                const unitObj = await Unit.findOne({ name: unit });
                if (unitObj) {
                    const prereq = unitObj.prereqTech ? unitObj.prereqTech : "None";
                    units.push(`Name: ${unitObj.name} - Prerequisite Technology: ${prereq} - Description: ${unitObj.info}`);
                }
            }

            const buildings = [];
            for (const building of doc.civ.uniqueBuildings) {
                const buildingObj = await Building.findOne({ name: building });
                if (buildingObj) {
                    const prereq = buildingObj.prereqTech ? buildingObj.prereqTech : "None";
                    buildings.push(`Name: ${buildingObj.name} - Prerequisite Technology: ${prereq} - Description: ${buildingObj.info}`);
                }
            }

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

            const sysPrompt = `
                You are a Sid Meier's Civilization V strategy assistant. 
                Return valid JSON with the structured fields: primaryVictory, secondaryVictory, general, counter. 
                The "general" field should contain **exactly two paragraphs** describing the strategy, separated by a blank line.
                The "counter" field should also contain **exactly two paragraphs** describing the counter-strategy, separated by a blank line.
                Briefly mention unique units/buildings, but balance civ-specific traits with broader game fundamentals.
                Align the strategy with the primary victory type and cover early to late game flow.
                Use general Civ V knowledge (e.g., build orders, tech paths, city placement) to guide decisions.
                Keep advice intuitive and gameplay-focused, not just a trait summary.
            `;

            // make call to LLM
            let response = await client.chat.completions.create({
                "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",
                "temperature": 0.5,
                "max_tokens": 500,
                "response_format": {
                    "type": "json_object",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "primaryVictory": {
                                "type": "string",
                                "enum": ["Domination", "Science", "Diplomatic", "Cultural"]
                            },
                            "secondaryVictory": {
                                "type": "string",
                                "enum": ["Domination", "Science", "Diplomatic", "Cultural"]
                            },
                            "general": {
                                "type": "string",
                                "description": "General strategy for playing as this civilization"
                            },
                            "counter": {
                                "type": "string",
                                "description": "Strategy to beat this civilization"
                            }
                        },
                        "required": ["primaryVictory", "secondaryVictory", "general", "counter"]
                    }
                },
                "messages": [
                    {
                        "role": "system",
                        "content": sysPrompt
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            });

            let strategy;
            let retries = 0;
            let maxRetries = 5;
            while (retries < maxRetries) {
                try {
                    strategy = JSON.parse(response.choices[0].message.content);
                    break;
                } catch (err) {
                    retries++;
                    if (retries < maxRetries) {
                        response = await client.chat.completions.create({
                            "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",
                            "temperature": 0.5,
                            "max_tokens": 500,
                            "response_format": {
                                "type": "json_object",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "primaryVictory": {
                                            "type": "string",
                                            "enum": ["Domination", "Science", "Diplomatic", "Cultural"]
                                        },
                                        "secondaryVictory": {
                                            "type": "string",
                                            "enum": ["Domination", "Science", "Diplomatic", "Cultural"]
                                        },
                                        "general": {
                                            "type": "string",
                                            "description": "General strategy for playing as this civilization"
                                        },
                                        "counter": {
                                            "type": "string",
                                            "description": "Strategy to beat this civilization"
                                        }
                                    },
                                    "required": ["primaryVictory", "secondaryVictory", "general", "counter"]
                                }
                            },
                            "messages": [
                                {
                                    "role": "system",
                                    "content": sysPrompt
                                },
                                {
                                    "role": "user",
                                    "content": message
                                }
                            ]
                        });
                    } else {
                        throw new Error("error parsing JSON when enriching strategy");
                    }
                }
            }
            console.log(`\n🏆 ${doc.civ.name} Strategy:`);
            console.log('Primary Victory:', strategy.primaryVictory);
            console.log('Secondary Victory:', strategy.secondaryVictory);

            doc.strategy = {
                primaryVictory: strategy.primaryVictory,
                secondaryVictory: strategy.secondaryVictory,
                general: strategy.general,
                counter: strategy.counter
            };

            await doc.save();
        }

    } catch (err) {
        console.error("error in enrichStrats: ", err);
    }
}