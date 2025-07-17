
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
    name: string;
    slug: string;
    icon: string;
  };
}

export interface PreviewProps {
  civs: CivPreview[];
}

export interface OverviewProps {
  civ: Civ;
}

interface Unit {
  name: string;
  icon: string;
  info: string;
  prereqTech: {
    name: string;
    era: string;
    icon: string;
  };
  strategy: string;
}

interface Building {
  name: string;
  icon: string;
  info: string;
  prereqTech: {
    name: string;
    era: string;
    icon: string;
  };
  strategy: string;
  yields: {
    gold: number;
    production: number;
    science: number;
    culture: number;
    food: number;
    faith: number;
    happiness: number;
  }
}

export interface Civ {
  civ: {
    name: string;
    slug: string;
    icon: string;
    uniqueUnits: Unit[];
    uniqueBuildings: Building[];
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

export interface Tech {
  name: string,
  cost: string,
  icon: string,
  prereqs: string[]
};

export interface OptimalTechs {
  ordering: string[];
  targets: string[];
};
