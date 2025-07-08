import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Civilization from "../models/Civilization.js";
import Unit from "../models/Unit.js";
import Building from "../models/Building.js";
import Tech from "../models/Tech.js";
import techGraph from './techGraph.js';
import { costCap, weightAssignment, priorityAssignment } from './scheduling.js';
dotenv.config();

const app = express();
app.use(express.json()); // parse json request bodies
app.use(morgan('dev')); // log requests

const base = new techGraph();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('mongo connected');
    await base.init();
    console.log('base graph built');
  })
  .catch((err) => console.error('mongo error:', err));

app.get('/api/health', (req, res) => {
  let healthy = true;

  if (!mongoose.connection.readyState) {
    healthy = false;
  }

  if (healthy) {
    res.status(200).json({ status: 'Civ Copilot API is running', mongoStatus: 'db is connected', timestamp: new Date().toLocaleString() });
  } else {
    res.status(503).json({ status: 'Civ Copilot API is running', mongoStatus: 'db is disconnected', timestamp: new Date().toLocaleString() });
  }
});

app.get('/api/civs', async (req, res) => {
  try {
    const civs = await Civilization.find({}, 'leader.name leader.subtitle leader.icon civ.name civ.slug civ.icon');
    res.status(200).json(civs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error Retrieving Civs' });
  }
});

app.get('/api/civs/:id', async (req, res) => {
  try {
    const slug = req.params.id;
    const root = await Civilization.findOne({ 'civ.slug': slug });
    
    if (!root) {
      return res.status(404).json({ error: `Civilization with slug "${slug}" not found` });
    }
    
    let rootObj = root.toObject();
  
    // retrieve units and buildings
    rootObj.civ.uniqueUnits = await Promise.all(rootObj.civ.uniqueUnits.map(async (unit) => {
      const details = await Unit.findOne({ 'name': unit }, 'name icon info prereqTech strategy -_id');
      let detailsObj = details.toObject();
      const techDetails = await Tech.findOne({'name': detailsObj.prereqTech}, 'name era icon -_id');
      detailsObj.prereqTech = techDetails;
      return detailsObj;
    }));

    rootObj.civ.uniqueBuildings = await Promise.all(rootObj.civ.uniqueBuildings.map(async (building) => {
      const details = await Building.findOne({ 'name': building }, 'name icon info prereqTech strategy yields -_id');
      let detailsObj = details.toObject();
      const techDetails = await Tech.findOne({'name': detailsObj.prereqTech}, 'name era icon -_id');
      detailsObj.prereqTech = techDetails;
      return detailsObj;
    }));

    res.status(200).json(rootObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err +  req.params.id});    
  }
});

app.get('/api/slugs', async (req, res) => {
  try{
    const details = await Civilization.find({}, 'civ.slug -_id');
    const slugs = details.map(({ civ }) => civ.slug);
    res.status(200).json(slugs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });    
  }
});

app.get('/api/techs', (req, res) => {
  
  const cpy = new techGraph(base);
  const nodeArr = Array.from(cpy.graph).map(([key, val]) => ({
    name: key,
    cost: val.cost,
    icon: val.icon,
    prereqs: val.prereqs
  }));

  res.status(200).json(nodeArr);
});

app.post('/api/techs', async (req, res) => {
  
  try {
    const { leader, playerScenario, techs } = req.body;
    const cpy = new techGraph(base);
    let highestCost = 0;
    for (const tech of techs) {
      const techCost = cpy.getCost(tech);
      if (!techCost) {throw new Error(`${tech} is an invalid tech`);}
      if(techCost > highestCost) {
        highestCost = techCost;
      }
    }
    // calculate cap based on highest cost tech researched
    const cap = costCap(highestCost);
    // create candidates graph
    const candidates = techGraph.candidateSubgraph(cpy, techs, cap);
    //'civ.slug leaderTrait.effect strategy.primaryVictory strategy.general -_id'
    const root = await Civilization.findOne({'leader.name': leader});
    const rootObj = root.toObject();

    // retrieve units
    rootObj.civ.uniqueUnits = await Promise.all(rootObj.civ.uniqueUnits.map(async (unit) => {
      const details = await Unit.findOne({ 'name': unit }, 'name prereqTech -_id');
      let detailsObj = details.toObject();
      return detailsObj;
    }));
    // retrieve buildings
    rootObj.civ.uniqueBuildings = await Promise.all(rootObj.civ.uniqueBuildings.map(async (building) => {
      const details = await Building.findOne({ 'name': building }, 'name prereqTech -_id');
      let detailsObj = details.toObject();
      return detailsObj;
    }));

    // build units string
    const units = rootObj.civ.uniqueUnits.length > 0 ? 
                rootObj.civ.uniqueUnits.map((u)=>(`{${u.name}, Prerequisite Technology: ${u.prereqTech}}`)).join(", ")
                : "None";
    // build buildings string
    const buildings = rootObj.civ.uniqueBuildings.length > 0 ? 
            rootObj.civ.uniqueBuildings.map((b)=>(`{${b.name}, Prerequisite Technology: ${b.prereqTech}}`)).join(", ")
            : "None";
    // build leader strategy string
    const leaderStrat = "Leader: " + leader + ", Leader Trait: " + rootObj.leader.leaderTrait.effect + ", Unique Units: " + units +
    ", Unique Buildings: " + buildings + ", Recommended Path: " + rootObj.strategy.primaryVictory + " Recommended Leader Strategy: " + rootObj.strategy.general;
    // weight techs (LLM Call)
    const weighted = {
        "techs": [
            {
                "name": "Mining",
                "weight": 10
            },
            {
                "name": "Drama and Poetry",
                "weight": 10
            },
            {
                "name": "Philosophy",
                "weight": 15
            },
            {
                "name": "Calendar",
                "weight": 20
            },
            {
                "name": "Optics",
                "weight": 25
            },
            {
                "name": "Writing",
                "weight": 30
            },
            {
                "name": "Engineering",
                "weight": 30
            },
            {
                "name": "Currency",
                "weight": 35
            },
            {
                "name": "Masonry",
                "weight": 40
            },
            {
                "name": "Construction",
                "weight": 45
            },
            {
                "name": "Mathematics",
                "weight": 50
            },
            {
                "name": "Bronze Working",
                "weight": 60
            },
            {
                "name": "Iron Working",
                "weight": 70
            },
            {
                "name": "The Wheel",
                "weight": 80
            },
            {
                "name": "Sailing",
                "weight": 90
            },
            {
                "name": "Horseback Riding",
                "weight": 98
            }
        ]
    }
    // const weighted = await weightAssignment(candidates, leaderStrat, playerScenario);
    const orderedWeights = weighted.techs.sort((a, b) => (a.weight - b.weight));

    // pop last three (highest)
    const len = orderedWeights.length;
    const targets = [orderedWeights[len - 1].name, orderedWeights[len - 2].name, orderedWeights[len - 3].name];
    
    // add priorities to candidates graph
    const weightedCandidates = priorityAssignment(candidates, orderedWeights);
    
    // create ancestor graph
    const ancestors = techGraph.ancestorSubgraph(weightedCandidates, targets);

    
    res.json({ "weighted": weighted, "ordered": orderedWeights,
      "priorities": Array.from(weightedCandidates.graph.values()).map(val => (`name: ${val.name} cost: ${val.cost} weight: ${val.weight} priority: ${val.priority}`)),
      "targets": targets
     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });       
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
