import { S } from "react-router/dist/development/register-DCE0tH5m";

export interface HealthResponse {
  status: string;
  mongoStatus: string;
  timestamp: string;
};

export interface CivPreview {
  leader: {
    name: string;
    subtitle: string;
    icon: string;
  };
  civ: {
    slug: string;
    icon: string;
  };
}

export interface Civ {
  civ: {
    name: string;
    slug: string;
    icon: string;
    uniqueBuildings: string[];
    uniqueUnits: string[];
    historicalInfo: {
      heading: string;
      text: string;
    }[];
  };
  leader: {
    name: string;
    subtitle: string;
    lived: string;
    icon: string;
    leaderTrait: {
        name: string;
        effect: string;
    };
  };
  strategy: {
    primaryVictory: string;
    secondaryVictory: string;
    general: string;
    counter: string;
  };
};
