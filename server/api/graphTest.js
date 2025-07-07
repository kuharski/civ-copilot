import techGraph from "./techGraph.js";

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const base = new techGraph();

async function test(){

  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('mongo connected');

    await base.init();
    console.log('base graph built');

    // console.log("-------------------- \n TESTING BASE \n --------------------");
    // for (const [key, val] of base.graph) {
    //   console.log(`${key}. Prereqs: ${val.prereqs} Postreqs: ${val.postreqs} Units: ${JSON.stringify(val.units)}` )
    // }

    // console.log("-------------------- \n TESTING CANDIDATE GRAPH \n --------------------");
    const candidates = techGraph.candidateSubgraph(base, ["Agriculture", "Archery", "Pottery", "Animal Husbandry", "Trapping"], 175);
    // for (const [key, val] of candidates.graph) {
    //   console.log(`${key}. Prereqs: ${val.prereqs} Postreqs: ${val.postreqs}`);
    // }

    console.log("-------------------- \n TESTING ANCESTOR GRAPH \n --------------------");
    const ancestors = techGraph.ancestorSubgraph(candidates, ["Philosophy", "Construction"]);
    for (const [key, val] of ancestors.graph) {
      console.log(`${key}. ${val.weight} Prereqs: ${val.prereqs} Units: ${val.units?.map((u)=>u.info)} Buildings: ${val.buildings?.map((b)=>b.info)}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('error:', err);
    await mongoose.disconnect();
  }
}

test();