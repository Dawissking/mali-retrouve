export interface User {
  id: string;
  phoneE164?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "CITIZEN" | "AGENT" | "CENTER_MANAGER" | "REGIONAL_ADMIN" | "NATIONAL_ADMIN" | "AUDITOR" | "TECH_ADMIN";
  centerId?: string;
  citizenProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    regionId: string;
    cercleId: string;
    communeId: string;
  };
  agentProfile?: {
    id: string;
    centerId: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  phoneE164: string;
  password: string;
}

export interface AgentLoginCredentials {
  email: string;
  password: string;
}

export interface AgentTotpCredentials {
  email: string;
  token: string;
}
