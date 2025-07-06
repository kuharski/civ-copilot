import techGraph from "./techGraph.js";

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function printTree(graph) {
  for (const [key, val] of graph) {
    console.log(`Tech: ${key} \n ${val.prereqs}`)
  }
}

const base = new techGraph();

async function test(){

  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('mongo connected');

    await base.init();
    console.log('base graph built');

    console.log("-------------------- \n TESTING BASE \n --------------------");
    for (const [key, val] of base.graph) {
      console.log(`${key}. Prereqs: ${val.prereqs} Postreqs: ${val.postreqs} Units: ${val.units}` )
    }

    console.log("-------------------- \n TESTING CANDIDATE GRAPH \n --------------------");
    const candidates = techGraph.candidateSubgraph(base, ["Agriculture", "Archery", "Pottery", "Animal Husbandry", "Trapping"], 175);
    for (const [key, val] of candidates.graph) {
      console.log(`${key}. Prereqs: ${val.prereqs} Postreqs: ${val.postreqs}`);
    }

    console.log("-------------------- \n TESTING ANCESTOR GRAPH \n --------------------");
    const ancestors = techGraph.ancestorSubgraph(candidates, ["Philosophy", "Construction"]);
    for (const [key, val] of ancestors.graph) {
      console.log(`${key}. Prereqs: ${val.prereqs}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('error:', err);
    await mongoose.disconnect();
  }
}

test();