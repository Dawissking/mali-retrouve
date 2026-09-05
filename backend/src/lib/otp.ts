import { randomInt } from 'crypto';

export function generateOtp(length: number): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }
  return otp;
}

export function generateOtpExpiry(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

export function isOtpExpired(expiresAt: Date): boolean {
  return Date.now() > expiresAt.getTime();
}
