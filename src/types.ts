export interface Flight {
  id: string;
  airline: string;
  price: number; // in USD
  duration: number; // in minutes
  stops: number; // 0, 1, 2, etc.
  rating: number; // 1 to 5
  baggageIncluded: boolean;
  departureTime: string; // e.g. "08:30 AM"
  arrivalTime: string; // e.g. "11:45 AM"
  flightNumber: string; // e.g. "UA 240"
}

export interface FactorWeights {
  price: number; // weight: 0 to 5
  duration: number; // weight: 0 to 5
  stops: number; // weight: 0 to 5
  rating: number; // weight: 0 to 5
}

export interface FactorScores {
  price: number;     // 0 to 100
  duration: number;  // 0 to 100
  stops: number;     // 0 to 100
  rating: number;    // 0 to 100
}

export interface ScoredFlight extends Flight {
  scores: FactorScores;
  totalScore: number; // 0 to 100 weighted average
}
