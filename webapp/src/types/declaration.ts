export type Nature = "DOCUMENT" | "OBJET";
export type DeclarationType = "LOSS" | "FOUND";

export type DeclarationStatus =
  | "BROUILLON"
  | "SOUMISE"
  | "EN_ATTENTE_RAPPROCHEMENT"
  | "CORRESPONDANCE_TROUVEE"
  | "EN_VALIDATION_HUMAINE"
  | "VALIDEE"
  | "RESTITUTION_PLANIFIEE"
  | "RESTITUEE"
  | "CLOTUREE"
  | "REJETEE"
  | "ARCHIVEE"
  | "EXPIREE"
  | "SUSPENDUE"
  | "CONTESTEE";

export interface Photo {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  objectKey: string;
}

export interface Declaration {
  id: string;
  type: DeclarationType;
  nature: Nature;
  status: DeclarationStatus;
  trackingNumber?: string;
  categoryId: string;
  domainId: string;
  typeId: string;
  description: string;
  documentNumber?: string;
  lossLocationLat?: number;
  lossLocationLng?: number;
  lossLocationDesc?: string;
  lossRegionId?: string;
  lossCercleId?: string;
  lossCommuneId?: string;
  findLocationLat?: number;
  findLocationLng?: number;
  findLocationDesc?: string;
  findRegionId?: string;
  findCercleId?: string;
  findCommuneId?: string;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
  category?: { id: string; code: string; labelFr: string };
  domain?: { id: string; code: string; labelFr: string };
  objectType?: { id: string; code: string; labelFr: string };
  citizen?: {
    user?: { phoneE164: string };
    firstName: string;
    lastName: string;
  };
}

export interface CreateDeclarationPayload {
  nature: Nature;
  type: DeclarationType;
  categoryId: string;
  domainId: string;
  typeId: string;
  description: string;
  documentNumber?: string;
  locationLat?: number;
  locationLng?: number;
  locationDesc?: string;
  regionId: string;
  cercleId: string;
  communeId: string;
  eventDate: string;
  photos?: Array<{ filename: string; mimeType: string; sizeBytes: number; data: string }>;
}
