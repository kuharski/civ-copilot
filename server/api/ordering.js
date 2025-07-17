import techGraph from "./techGraph.js";
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.fireworks.ai/inference/v1"
});

export async function weightAssignment(candidates, leaderStrat, playerScenario) {
    try {


        const sysPrompt = `
            You are a Sid Meier's Civilization V expert strategy assistant.

            Your task is to assign a numeric weight (1–100) to each provided technology, depending on how important it is to the given leader's abilities and the player's scenario.  
            - Prioritize synergy with the leader's unique traits, unique units, and unique buildings first (75% of the weight).  
            - Consider the player's described scenario second (25% of the weight).

            When assigning weights, always use the full range from 1 to 100. 
            - Reserve 100 for the most critical techs, and 1 for techs that are almost entirely useless.
            - Assign mid-range values (e.g., 40–60) to techs of moderate usefulness, and lower mid-range values (e.g., 10–30) to techs that are situational but not completely worthless.
            - Avoid clustering many techs around the same weight. Instead, distribute weights relatively, so that the most important techs are close to 100 and the least important are close to 1, with others spaced meaningfully in between.
            - Think of the weights as a ranking: each technology should clearly stand apart in importance. Use intermediate values liberally to express nuanced differences.

            When analyzing consider the following.
            - The leader's traits, recommended victory type, and recommended strategy.
            - Unique unit and building prerequisite technologies (prioritize these heavily).
            - The player's stated scenario.

            Be rigorous and tactical, like an advanced Civ V player advising a tournament-level game.
            `;

        const techList = Array.from(candidates.graph.values()).map((tech) => {

            const units = tech.units && tech.units.length > 0 ?
                tech.units.map(u => `{${u.name}}`).join(", ") : "None";

            const buildings = tech.buildings && tech.buildings.length > 0 ?
                tech.buildings.map(b => `{${b.name}}`).join(", ") : "None";
            return `Technology: ${tech.name}\nUnit Unlocks: ${units}\nBuildings Unlocks: ${buildings}`;
        });
        const message = [
            `${leaderStrat}`,
            `Player Scenario:\n ${playerScenario}`,
            `List of Technologies:\n${techList}`,
            `Please analyze and return the weighted list of Technologies in structured JSON format as described.`].join("\n\n");

        // Call LLM
        const response = await client.chat.completions.create({
            "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",
            "temperature": 0.5,
            "max_tokens": 500,
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "tech_weights",
                    "strict": true,
                    "description": "Tech Weights",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "techs": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "name": {
                                            "type": "string",
                                            "description": "The name of the Technology"
                                        },
                                        "weight": {
                                            "type": "number",
                                            "description": "The assigned weight from 1 to 100",
                                        }
                                    },
                                    "required": ["name", "weight"]
                                }
                            }
                        },
                        "additionalProperties": false,
                        "required": ["techs"]
                    }
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

        try {
            const weightedTechs = JSON.parse(response.choices[0].message.content);
            return weightedTechs;
        } catch (err) {
            console.error("Failed to parse JSON from LLM", err);
            throw err;
        }
    } catch (err) {
        console.error("error in weight assignment: ", err);
    }
}

export function priorityAssignment(candidates, orderedWeights) {

    const cpy = new techGraph(candidates);

    // for normalization
    let costMin = Infinity;
    let costMax = -Infinity;

    for (const [name, node] of cpy.graph.entries()) {
        const techCost = Number(node.cost);

        if (techCost >= costMax) {
            costMax = techCost;
        }
        if (techCost <= costMin) {
            costMin = techCost;
        }
    }

    const weightMin = Number(orderedWeights[0].weight);
    const weightMax = Number(orderedWeights[orderedWeights.length - 1].weight);

    for (const { name, weight } of orderedWeights) {
        const techCost = Number(cpy.getCost(name));

        // normalize cost
        const normCost = (techCost - costMin) / (costMax - costMin);
        // normalize weight
        const normWeight = (weight - weightMin) / (weightMax - weightMin);

        // compute and set priority
        const val = cpy.graph.get(name);
        val.weight = weight;
        val.priority = (normWeight + 0.01) / (normCost + 0.01);
        cpy.graph.set(name, val);
    }

    return cpy;
}

export function priorityTopoSort(ancestors) {
    const cpy = new techGraph(ancestors);

    let ordering = [];
    // next to be picked for ordering
    const readyQueue = new MaxPriorityQueue((node) => node.priority);
    // degree updates handled directly in cpy.graph
    // preprocessing
    for (const [key, node] of cpy.graph) {
        node.degree = node.prereqs.length;

        if (node.degree === 0) {
            readyQueue.enqueue(node);
        }
    }
    //console.log(readyQueue.toArray());
    while (!readyQueue.isEmpty()) {
        // fifo among ties
        const next = readyQueue.dequeue();

        (next.postreqs || []).forEach((name) => {
            // update degree of postreq in cpy.graph
            // console.log(name);
            const postNode = cpy.graph.get(name);
            // console.log(postNode);
            postNode.degree -= 1;
            if (postNode.degree === 0) {
                readyQueue.enqueue(postNode);
            }
            cpy.graph.set(name, postNode);
        });
        // push onto ordering
        ordering.push(next.name);
    }

    return ordering;
}

export function costCap(cost) {
    //console.log(`COST GIVEN TO COSTCAP: ${cost}`);
    if (0 <= cost && cost <= 55) { //ancient
        return 175;
    } else if (55 < cost && cost <= 175) { //classical
        return 485;
    } else if (175 < cost && cost <= 485) { //medieval
        return 1150;
    } else if (485 < cost && cost <= 1150) { // renaissance
        return 2350;
    } else if (1150 < cost && cost <= 2350) { // industrial
        return 4100;
    } else if (2350 < cost && cost <= 4100) { // modern
        return 6400;
    } else if (4100 < cost && cost <= 6400) { // atomic
        return 10000;
    } else {
        return 10000;
    }
}
