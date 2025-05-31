import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ingestCivs from "./civs.js";
import ingestBuildings from "./buildings.js";
import ingestWonders from "./wonders.js";
import ingestTechs from "./techs.js";
import ingestPolicyTrees from "./policyTrees.js";
import ingestUnits from "./unit.js";
import enrichStrats from "./stratEnrichment.js";

async function main() {
  // connect
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongo connected'))
    .catch((err) => console.error('mongo error connecting:', err));

  // load data - must ingest techs first (buildings and units rely on it)
  await ingestTechs();
  await ingestCivs();
  await ingestBuildings();
  await ingestWonders();
  await ingestPolicyTrees();
  await ingestUnits();
  await enrichStrats();
  // disconnect
  await mongoose.disconnect()
    .then(() => console.log('mongo disconnected'))
    .catch((err) => console.error('mongo error disconnecting:', err));
}

main();
