import { z } from 'zod';

export const requestOtpSchema = z.object({
  phoneE164: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format'),
});

export const verifyOtpSchema = z.object({
  phoneE164: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format'),
  code: z.string().min(6).max(6),
});

export const registerSchema = z.object({
  phoneE164: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format'),
  otpCode: z.string().min(6).max(6),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name required').max(100),
  lastName: z.string().min(2, 'Last name required').max(100),
  birthDate: z.string().datetime(),
  regionId: z.string().uuid(),
  cercleId: z.string().uuid(),
  communeId: z.string().uuid(),
});

export const citizenLoginSchema = z.object({
  phoneE164: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format'),
  password: z.string().min(8),
});

export const agentLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const totpVerifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(6),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const requestOtpResetSchema = z.object({
  phoneE164: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format'),
});
