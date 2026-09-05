export interface Center {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude?: number;
  longitude?: number;
  regionId: string;
  cercleId: string;
  communeId: string;
  villageId?: string;
  capacity?: number;
  timezone?: string;
  isActive: boolean;
  region?: { id: string; code: string; labelFr: string };
  cercle?: { id: string; code: string; labelFr: string };
  commune?: { id: string; code: string; labelFr: string };
  agents?: Array<{
    id: string;
    employeeId?: string;
    isActive: boolean;
    canValidate: boolean;
    canDoubleValidate: boolean;
    user: { id: string; email: string; role: string; isActive: boolean };
  }>;
}

export interface Agent {
  id: string;
  userId: string;
  centerId: string;
  employeeId?: string;
  isActive: boolean;
  canValidate: boolean;
  canDoubleValidate: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}
