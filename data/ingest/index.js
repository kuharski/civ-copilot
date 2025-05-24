import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ingestCivs from "./civs.js";
import ingestBuildings from "./buildings.js";
import ingestWonders from "./wonders.js";
import ingestTechs from "./techs.js";
import ingestPolicyTrees from "./policytrees.js";

async function main() {
    // connect
    await mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('mongo connected'))
      .catch((err) => console.error('mongo error connecting:', err));

    // load data
    await ingestCivs();
    await ingestBuildings();
    await ingestWonders();
    await ingestTechs();
    await ingestPolicyTrees();

    // disconnect
    await mongoose.disconnect()
      .then(() => console.log('mongo disconnected'))
      .catch((err) => console.error('mongo error disconnecting:', err));
}

main();
