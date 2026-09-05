import { Request, Response } from 'express';
import { authMiddleware } from '@app/middleware/auth';
import { prisma } from '@app/lib/prisma';
import { signAccessToken } from '@app/lib/jwt';

describe('authMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: jest.Mock;

  beforeEach(() => {
    nextFn = jest.fn();
    mockReq = {
      headers: {},
      cookies: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('PUBLIC access', () => {
    it('should allow PUBLIC access without token', async () => {
      const middleware = authMiddleware('PUBLIC');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect(nextFn).toHaveBeenCalled();
    });

    it('should set correlationId for PUBLIC access', async () => {
      mockReq.headers = { 'x-correlation-id': 'test-correlation-id' };
      const middleware = authMiddleware('PUBLIC');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect((mockReq as any).correlationId).toBe('test-correlation-id');
    });
  });

  describe('authenticated access', () => {
    it('should reject when no token provided and role required', async () => {
      const middleware = authMiddleware('CITIZEN');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should accept Bearer token when role is allowed', async () => {
      const user = await prisma.user.findFirst({
        where: { role: 'CITIZEN' },
      });
      if (!user) {
        return;
      }

      const token = signAccessToken(user.id, user.role, 'session-1');
      mockReq.headers = { authorization: `Bearer ${token}` };

      const middleware = authMiddleware('CITIZEN');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect(nextFn).toHaveBeenCalled();
      expect((mockReq as any).user).toBeDefined();
      expect((mockReq as any).user.role).toBe('CITIZEN');
    });

    it('should reject invalid token', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      const middleware = authMiddleware('CITIZEN');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    });
  });

  describe('role hierarchy', () => {
    it('should deny lower role access to higher role protected route', async () => {
      const user = await prisma.user.findFirst({
        where: { role: 'CITIZEN' },
      });
      if (!user) return;

      const token = signAccessToken(user.id, user.role, 'session-1');
      mockReq.headers = { authorization: `Bearer ${token}` };

      const middleware = authMiddleware('NATIONAL_ADMIN');
      await middleware(mockReq as Request, mockRes as Response, nextFn);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    });
  });
});
