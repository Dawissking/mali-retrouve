import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyAccessToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export type RequiredRole = UserRole | 'PUBLIC' | UserRole[];

export function authMiddleware(requiredRole: RequiredRole = 'PUBLIC') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token && requiredRole === 'PUBLIC') {
      (req as any).correlationId = (req.headers['x-correlation-id'] as string) || undefined;
      return next();
    }

    if (!token) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    if (payload.type !== 'access') {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Invalid token type' },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        citizenProfile: { include: { region: true, cercle: true, commune: true } },
        agentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: { code: 'USER_NOT_FOUND', message: 'User not found or inactive' },
      });
    }

    (req as any).user = {
      id: user.id,
      email: user.email,
      phoneE164: user.phoneE164,
      role: user.role,
      isActive: user.isActive,
      citizenProfile: user.citizenProfile
        ? {
            id: user.citizenProfile.id,
            firstName: user.citizenProfile.firstName,
            lastName: user.citizenProfile.lastName,
            regionId: user.citizenProfile.regionId,
            cercleId: user.citizenProfile.cercleId,
            communeId: user.citizenProfile.communeId,
          }
        : undefined,
      agentProfile: user.agentProfile
        ? { id: user.agentProfile.id, centerId: user.agentProfile.centerId }
        : undefined,
    };

    if (requiredRole !== 'PUBLIC') {
      const authUser = (req as any).user;
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!authUser || !isAuthorized(authUser.role, allowedRoles)) {
        logger.warn({ userId: user.id, role: user.role, required: requiredRole }, 'Authorization denied');
        return res.status(403).json({
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }
    }

    (req as any).correlationId = (req.headers['x-correlation-id'] as string) || payload.sessionId;
    next();
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
}

function isAuthorized(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    CITIZEN: 1,
    AGENT: 2,
    CENTER_MANAGER: 3,
    REGIONAL_ADMIN: 4,
    NATIONAL_ADMIN: 5,
    AUDITOR: 5,
    TECH_ADMIN: 5,
  };

  const requiredLevel = Math.min(...requiredRoles.map(r => roleHierarchy[r] ?? 0));
  const userLevel = roleHierarchy[userRole] ?? 0;

  return userLevel >= requiredLevel;
}
