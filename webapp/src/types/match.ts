export type MatchStatus = "CANDIDATE" | "POTENTIAL" | "TO_VERIFY" | "CONFIRMED" | "REJECTED" | "CLOSED";

export interface DeclarationSummary {
  id: string;
  type: string;
  status: string;
  description: string;
  photos: Array<{ id: string; filename: string; mimeType: string }>;
  category?: { id: string; code: string; labelFr: string };
  domain?: { id: string; code: string; labelFr: string };
  objectType?: { id: string; code: string; labelFr: string };
  citizen?: {
    user?: { phoneE164: string };
    firstName: string;
    lastName: string;
  };
}

export interface Match {
  id: string;
  lostDeclarationId: string;
  foundDeclarationId: string;
  score: number;
  scoreBreakdown?: any;
  status: MatchStatus;
  candidateRank?: number;
  createdAt: string;
  updatedAt: string;
  lostDeclaration: DeclarationSummary;
  foundDeclaration: DeclarationSummary;
  validations?: Array<{ id: string; decision: string; reason?: string; validatedAt: string }>;
}
