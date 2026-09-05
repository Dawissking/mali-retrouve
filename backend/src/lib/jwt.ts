import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  role: string;
  type: 'access' | 'refresh';
  sessionId: string;
}

const accessOpts: SignOptions = { expiresIn: config.jwtAccessExpires as any };
const refreshOpts: SignOptions = { expiresIn: config.jwtRefreshExpires as any };

export function signAccessToken(userId: string, role: string, sessionId: string): string {
  const payload: JwtPayload = { userId, role, type: 'access', sessionId };
  return jwt.sign(payload, config.jwtSecret, accessOpts);
}

export function signRefreshToken(userId: string, role: string, sessionId: string): string {
  const payload: JwtPayload = { userId, role, type: 'refresh', sessionId };
  return jwt.sign(payload, config.jwtRefreshSecret, refreshOpts);
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
  } catch {
    return null;
  }
}
