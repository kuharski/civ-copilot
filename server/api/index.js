import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Civilization from "../models/Civilization.js";

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
    const civs = await Civilization.find({}, 'civ.name civ.slug strategy.primaryVictory -_id');
    res.status(200).json(civs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
