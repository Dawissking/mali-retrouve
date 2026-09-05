import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TotpSecret {
  base32: string;
  otpauth_url: string;
}

export function generateTotpSecret(name: string, issuer: string): TotpSecret {
  const secret = speakeasy.generateSecret({
    name,
    issuer,
    length: 20,
  });
  return { base32: secret.base32 ?? '', otpauth_url: secret.otpauth_url ?? '' };
}

export function verifyTotp(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    token,
    window: 1,
  });
}

export async function generateQrCode(data: string): Promise<string> {
  return QRCode.toDataURL(data);
}
