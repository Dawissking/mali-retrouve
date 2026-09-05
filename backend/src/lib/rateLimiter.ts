import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});

export const otpRateLimiter = rateLimit({
  windowMs: config.otp.cooldownSeconds * 1000,
  max: 3,
  message: {
    error: {
      code: 'OTP_RATE_LIMITED',
      message: `Please wait ${config.otp.cooldownSeconds} seconds before requesting another OTP.`,
    },
  },
});
