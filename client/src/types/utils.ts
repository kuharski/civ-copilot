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
