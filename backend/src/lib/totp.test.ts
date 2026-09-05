import { generateTotpSecret, verifyTotp, generateQrCode } from '@app/lib/totp';

describe('TOTP utilities', () => {
  it('should generate a TOTP secret with base32 and otpauth_url', () => {
    const secret = generateTotpSecret('testuser', 'TestApp');
    expect(secret.base32).toBeTruthy();
    expect(secret.otpauth_url).toBeTruthy();
    expect(secret.otpauth_url).toContain('otpauth://totp/');
    expect(secret.otpauth_url).toContain('TestApp');
    expect(secret.otpauth_url).toContain('testuser');
  });

  it('should generate a valid TOTP token that verifies', () => {
    const secret = generateTotpSecret('testuser', 'TestApp');
    const token = generateTotpToken(secret.base32);
    const valid = verifyTotp(token, secret.base32);
    expect(valid).toBe(true);
  });

  it('should reject an invalid TOTP token', () => {
    const secret = generateTotpSecret('testuser', 'TestApp');
    const valid = verifyTotp('000000', secret.base32);
    expect(valid).toBe(false);
  });

  it('should generate a QR code data URL', async () => {
    const qr = await generateQrCode('otpauth://totp/TestApp:testuser?secret=ABC123&issuer=TestApp');
    expect(qr).toMatch(/^data:image\/png;base64,/);
  });
});

function generateTotpToken(secret: string): string {
  const speakeasy = require('speakeasy');
  return speakeasy.totp({ secret });
}
