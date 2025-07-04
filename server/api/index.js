import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Civilization from "../models/Civilization.js";
import Unit from "../models/Unit.js";
import Building from "../models/Building.js";
import Tech from "../models/Tech.js";

dotenv.config();

const app = express();
app.use(express.json()); // parse json request bodies
app.use(morgan('dev')); // log requests

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('mongo connected'))
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
