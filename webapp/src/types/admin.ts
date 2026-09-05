export interface AdminStats {
  declarations: Array<{ status: string; _count: { _all: number } }>;
  matches: Array<{ status: string; _count: { _all: number } }>;
  users: { _count: { _all: number } };
  byCategory: Array<{ categoryId: string; createdAt: string; _count: { _all: number } }>;
}

export interface Policy {
  key: string;
  value: any;
  description?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type: string;
  status: "DETECTED" | "ANALYZED" | "CONTAINED" | "REMEDIATED" | "RESOLVED" | "REPORTED_APDP";
  title: string;
  description: string;
  detectedAt: string;
  containedAt?: string;
  remediatedAt?: string;
  reportedToApdpAt?: string;
  reportedToApdp: boolean;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  beforeHash?: string;
  afterHash?: string;
  ip?: string;
  userAgent?: string;
  occurredAt: string;
  correlationId: string;
  chainHash?: string;
  signature?: string;
  user?: { id: string; phoneE164?: string; email?: string; role: string };
}
