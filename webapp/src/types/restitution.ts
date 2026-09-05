export type RestitutionStatus = "PENDING" | "VERIFIED" | "COMPLETED" | "REJECTED" | "CANCELLED";

export interface Restitution {
  id: string;
  declarationId: string;
  lostDeclarationId: string;
  foundDeclarationId: string;
  matchId?: string;
  centerId: string;
  agentId: string;
  citizenId: string;
  status: RestitutionStatus;
  identityDocPhotoId?: string;
  objectPhotoId?: string;
  signatureProof?: string;
  signatureType?: string;
  otpVerified?: boolean;
  notes?: string;
  plannedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  declaration?: {
    description: string;
    photos: Array<{ id: string; filename: string; mimeType: string }>;
    citizen?: { user?: { phoneE164: string }; firstName: string; lastName: string };
  };
  identityDocPhoto?: { id: string; filename: string; objectKey: string };
  objectPhoto?: { id: string; filename: string; objectKey: string };
  match?: { id: string; status: string };
  citizen?: { id: string; firstName: string; lastName: string };
  center?: { id: string; name: string };
}
