import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { hashPassword, verifyPassword } from '../../lib/argon2';
import { generateOtp, generateOtpExpiry } from '../../lib/otp';
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } from '../../lib/jwt';
import { config } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../lib/logger';
import { queueNotification } from '../../lib/notifications';
import { NotificationChannel } from '@prisma/client';
import {
  requestOtpSchema,
  verifyOtpSchema,
  registerSchema,
  citizenLoginSchema,
  agentLoginSchema,
  totpVerifySchema,
  refreshSchema,
  requestOtpResetSchema,
} from './auth.schemas';

const router = Router();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: unknown) {
      const e = err as z.ZodError;
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: e.errors },
      });
    }
  };
}

function hashPhone(phoneE164: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(`salt:${phoneE164}`).digest('hex');
}

// --- Citizen: Request OTP ---
router.post('/otp/request', validate(requestOtpSchema), async (req: Request, res: Response) => {
  const { phoneE164 } = req.body;
  const correlationId = req.correlationId || uuidv4();

  const existingOtp = await prisma.otpCode.findFirst({
    where: {
      phoneE164,
      purpose: 'sms_verify',
      expiresAt: { gt: new Date() },
      usedAt: null,
      failedAttempts: { lt: config.otp.maxAttempts },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existingOtp) {
    return res.status(429).json({
      error: { code: 'OTP_TOO_RECENT', message: 'OTP already sent, please wait before requesting a new one.' },
    });
  }

  const code = generateOtp(config.otp.length);
  const otpHash = await hashPassword(code);

  await prisma.otpCode.create({
    data: {
      phoneE164,
      codeHash: otpHash,
      purpose: 'sms_verify',
      expiresAt: generateOtpExpiry(config.otp.expiresInSeconds),
    },
  });

  if (config.sms.consoleEnabled) {
    logger.info({ phone: phoneE164, code, expiresInSeconds: config.otp.expiresInSeconds }, 'DEV OTP');
  }

  await queueNotification(
    NotificationChannel.SMS,
    `Votre code de verification MALI RETROUVE est : ${code}. Valable ${config.otp.expiresInSeconds / 60} minutes.`,
    phoneE164,
    undefined,
    undefined,
    'otp_sms_verify',
    undefined,
    { eventType: 'OTP_SENT', provider: 'MOCK', correlationId }
  );

  res.json({ message: 'OTP sent successfully' });
  return;
});

// --- Citizen: Verify OTP ---
router.post('/otp/verify', validate(verifyOtpSchema), async (req: Request, res: Response) => {
  const { phoneE164, code } = req.body;

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      phoneE164,
      purpose: 'sms_verify',
      usedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return res.status(404).json({ error: { code: 'OTP_NOT_FOUND', message: 'OTP record not found' } });
  }

  if (otpRecord.expiresAt < new Date()) {
    return res.status(410).json({ error: { code: 'OTP_EXPIRED', message: 'OTP has expired' } });
  }

  if (otpRecord.failedAttempts >= config.otp.maxAttempts) {
    return res.status(429).json({ error: { code: 'OTP_MAX_ATTEMPTS', message: 'Maximum attempts exceeded' } });
  }

  const valid = await verifyPassword(code, otpRecord.codeHash);
  if (!valid) {
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { failedAttempts: { increment: 1 } },
    });
    return res.status(401).json({ error: { code: 'OTP_INVALID', message: 'Invalid OTP code' } });
  }

  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });

  const existingUser = await prisma.user.findUnique({
    where: { phoneE164 },
    include: { citizenProfile: true },
  });

  if (!existingUser) {
    return res.json({ phoneVerified: true, isRegistered: false, message: 'Phone verified, proceed to registration' });
  }

  return res.json({ phoneVerified: true, isRegistered: true, message: 'Phone verified' });
});

// --- Citizen: Register ---
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  const { phoneE164, password, otpCode, firstName, lastName, birthDate, regionId, cercleId, communeId } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { phoneE164 } });
  if (existingUser) {
    return res.status(409).json({ error: { code: 'USER_EXISTS', message: 'Phone number already registered' } });
  }

  const otpRecord = await prisma.otpCode.findFirst({
    where: { phoneE164, purpose: 'sms_verify', usedAt: { not: null }, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return res.status(400).json({ error: { code: 'OTP_REQUIRED', message: 'Phone verification required first' } });
  }

  const otpValid = await verifyPassword(otpCode, otpRecord.codeHash);
  if (!otpValid) {
    return res.status(401).json({ error: { code: 'OTP_INVALID', message: 'Invalid OTP code' } });
  }

  const passwordHash = await hashPassword(password);
  const phoneHash = hashPhone(phoneE164);
  const correlationId = uuidv4();

  const user = await prisma.user.create({
    data: {
      phoneE164,
      phoneHash,
      emailVerified: false,
      passwordHash,
      role: 'CITIZEN',
      isActive: true,
      citizenProfile: {
        create: {
          firstName,
          lastName,
          birthDate: new Date(birthDate),
          regionId,
          cercleId,
          communeId,
        },
      },
    },
    include: { citizenProfile: true },
  });

  const sessionId = uuidv4();
  const accessToken = signAccessToken(user.id, user.role, sessionId);
  const refreshToken = signRefreshToken(user.id, user.role, sessionId);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: await hashPassword(refreshToken),
      ip: req.ip ?? 'unknown',
      userAgent: req.get('user-agent') ?? '',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  await queueNotification(
    NotificationChannel.IN_APP,
    `Bienvenue ${firstName} ! Votre compte a ete cree avec succes.`,
    undefined,
    undefined,
    user.id,
    'citizen_register_welcome',
    'Bienvenue sur MALI RETROUVE',
    { eventType: 'WELCOME', provider: 'IN_APP', correlationId }
  );

  return res.status(201).json({
    user: { id: user.id, phoneE164: user.phoneE164, role: user.role, citizenProfile: user.citizenProfile },
    accessToken,
    refreshToken,
  });
});

// --- Citizen login ---
router.post('/login', validate(citizenLoginSchema), async (req: Request, res: Response) => {
  const { phoneE164, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { phoneE164 },
    include: { citizenProfile: true },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
  }

  const sessionId = uuidv4();
  const accessToken = signAccessToken(user.id, user.role, sessionId);
  const refreshToken = signRefreshToken(user.id, user.role, sessionId);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: await hashPassword(refreshToken),
      ip: req.ip ?? 'unknown',
      userAgent: req.get('user-agent') ?? '',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  return res.json({
    user: { id: user.id, phoneE164: user.phoneE164, role: user.role, citizenProfile: user.citizenProfile },
    accessToken,
    refreshToken,
  });
});

// --- Agent login (password + TOTP) ---
router.post('/agent/login', validate(agentLoginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { agentProfile: { include: { center: true } } },
  });

  if (!user || !user.isActive || (user.role !== 'AGENT' && user.role !== 'CENTER_MANAGER' && user.role !== 'REGIONAL_ADMIN' && user.role !== 'NATIONAL_ADMIN' && user.role !== 'TECH_ADMIN' && user.role !== 'AUDITOR')) {
    return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
  }

  if (!user.mfaEnabled) {
    const sessionId = uuidv4();
    const accessToken = signAccessToken(user.id, user.role, sessionId);
    const refreshToken = signRefreshToken(user.id, user.role, sessionId);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await hashPassword(refreshToken),
        ip: req.ip ?? 'unknown',
        userAgent: req.get('user-agent') ?? '',
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    });

    return res.json({
      mfaRequired: false,
      user: { id: user.id, email: user.email, role: user.role, agentProfile: user.agentProfile },
      accessToken,
      refreshToken,
    });
  }

  return res.json({ mfaRequired: true, message: 'Password verified, TOTP required' });
});

// --- Agent TOTP verification ---
router.post('/agent/login/totp', validate(totpVerifySchema), async (req: Request, res: Response) => {
  const { email, token } = req.body;
  const { verifyTotp } = await import('../../lib/totp');

  const user = await prisma.user.findUnique({
    where: { email },
    include: { agentProfile: true },
  });

  if (!user || !user.mfaEnabled || !user.totpSecret) {
    return res.status(401).json({ error: { code: 'MFA_NOT_ENABLED', message: 'MFA not enabled' } });
  }

  const valid = verifyTotp(token, user.totpSecret);
  if (!valid) {
    return res.status(401).json({ error: { code: 'MFA_INVALID', message: 'Invalid TOTP token' } });
  }

  const sessionId = uuidv4();
  const accessToken = signAccessToken(user.id, user.role, sessionId);
  const refreshToken = signRefreshToken(user.id, user.role, sessionId);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: await hashPassword(refreshToken),
      ip: req.ip ?? 'unknown',
      userAgent: req.get('user-agent') ?? '',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  return res.json({
    user: { id: user.id, email: user.email, role: user.role, agentProfile: user.agentProfile },
    accessToken,
    refreshToken,
  });
});

// --- Refresh token ---
router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });
  }

  const storedSession = await prisma.session.findFirst({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!storedSession || !(await verifyPassword(refreshToken, storedSession.tokenHash))) {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });
  }

  if (storedSession.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: storedSession.id } });
    return res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'Session expired' } });
  }

  const sessionId = uuidv4();
  const accessToken = signAccessToken(payload.userId, payload.role, sessionId);
  const newRefreshToken = signRefreshToken(payload.userId, payload.role, sessionId);

  await prisma.session.create({
    data: {
      userId: payload.userId,
      tokenHash: await hashPassword(newRefreshToken),
      ip: req.ip ?? 'unknown',
      userAgent: req.get('user-agent') ?? '',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  return res.json({ accessToken, refreshToken: newRefreshToken });
});

// --- Logout ---
router.post('/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyRefreshToken(token) || verifyAccessToken(token);
    if (payload) {
      await prisma.session.deleteMany({ where: { userId: payload.userId } });
    }
  }
   res.clearCookie('accessToken')
   res.clearCookie('refreshToken')
  return res.json({ message: 'Logged out successfully' });
});

// --- Password reset request ---
router.post('/password-reset/request', validate(requestOtpResetSchema), async (req: Request, res: Response) => {
  const { phoneE164 } = req.body;

  const user = await prisma.user.findUnique({ where: { phoneE164 } });
  if (!user) {
    return res.json({ message: 'If the phone number exists, an OTP will be sent' });
  }

  const code = generateOtp(config.otp.length);
  const otpHash = await hashPassword(code);

  await prisma.otpCode.create({
    data: {
      phoneE164,
      codeHash: otpHash,
      purpose: 'password_reset',
      expiresAt: generateOtpExpiry(config.otp.expiresInSeconds),
    },
  });

  if (config.sms.consoleEnabled) {
    logger.info({ phone: phoneE164, code }, 'DEV OTP RESET');
  }

  await queueNotification(
    NotificationChannel.SMS,
    `Code de reinitialisation: ${code}. Valable ${config.otp.expiresInSeconds / 60} minutes.`,
    phoneE164,
    undefined,
    undefined,
    'otp_password_reset',
    undefined,
    { eventType: 'OTP_RESET', provider: 'MOCK', correlationId: req.correlationId || uuidv4() }
  );

  res.json({ message: 'If the phone number exists, an OTP will be sent' });
  return;
});

// --- Password reset ---
router.post('/password-reset', async (req: Request, res: Response) => {
  const schema = z.object({
    phoneE164: z.string().regex(/^\+\d{8,15}$/),
    otpCode: z.string().min(6).max(6),
    newPassword: z.string().min(8),
  });

  try {
    req.body = schema.parse(req.body);
  } catch (err: unknown) {
    const e = err as z.ZodError;
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: e.errors } });
  }

  const { phoneE164, otpCode, newPassword } = req.body;

  const otpRecord = await prisma.otpCode.findFirst({
    where: { phoneE164, purpose: 'password_reset', usedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord || otpRecord.expiresAt < new Date() || otpRecord.failedAttempts >= config.otp.maxAttempts) {
    return res.status(401).json({ error: { code: 'OTP_INVALID', message: 'Invalid or expired OTP' } });
  }

  const valid = await verifyPassword(otpCode, otpRecord.codeHash);
  if (!valid) {
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { failedAttempts: { increment: 1 } } });
    return res.status(401).json({ error: { code: 'OTP_INVALID', message: 'Invalid OTP code' } });
  }

  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { usedAt: new Date() } });
  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { phoneE164 },
    data: { passwordHash },
  });

  return res.json({ message: 'Password updated successfully' });
});

export default router;
