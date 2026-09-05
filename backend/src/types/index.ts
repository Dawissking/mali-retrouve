export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface MatchScore {
  score: number;
  breakdown: Record<string, { score: number; weight: number; detail: string }>;
  determiningCriteria: string[];
}

export interface MatchingCandidate {
  declarationId: string;
  type: string;
  nature: string;
  description: string;
  location?: { regionId: string; cercleId: string; communeId: string };
  declarationDate: Date | null;
  objectType: string | null;
  distance: number | null;
  daysDifference: number | null;
}

export interface MatchingEngineProvider {
  findCandidates(target: MatchingCandidate): Promise<MatchingCandidate[]>;
  computeScore(target: MatchingCandidate, candidate: MatchingCandidate): Promise<MatchScore>;
}
