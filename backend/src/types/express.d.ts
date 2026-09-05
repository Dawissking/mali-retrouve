import 'dotenv/config';
import { expand } from 'dotenv-expand';
import { UserRole } from '@prisma/client';

expand(process.env as any);

interface CustomRequest {
  user?: {
    id: string;
    email: string | null;
    phoneE164: string | null;
    role: UserRole;
    isActive: boolean;
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
  };
  correlationId?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: CustomRequest['user'];
      correlationId?: string;
    }
  }
}

export {};
