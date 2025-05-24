import mongoose from "mongoose";

const validVictoryTypes = ["Domination", "Science", "Diplomatic", "Cultural"];
const CivilizationSchema = new mongoose.Schema({
  civ: {
    name: String,
    icon: String,
    uniqueBuildings: [String],
    uniqueUnits: [String],
    historicalInfo: [
        {
        heading: String,
        text: String
        }
    ],
  },
  leader: {
    name: String,
    subtitle: String,
    lived: String,
    icon: String,
    leaderTrait: {
        name: String,
        effect: String
    }
  },
  strategy: {
    primaryVictory: {
      type: String,
      enum: validVictoryTypes
    },
    secondaryVictory: {
      type: String,
      enum: validVictoryTypes,
      validate: {
        validator: function (val) {
          return val !== this.strategy.primaryVictory;
        },
        message: "secondary victory condition must be different from primary"
      }
    },
    general: String,
    counter: String
  }
});

export default mongoose.model("Civilization", CivilizationSchema);
