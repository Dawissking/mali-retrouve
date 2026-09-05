import { prisma } from '@app/lib/prisma';
import { hashPassword, verifyPassword } from '@app/lib/argon2';

describe('argon2 password hashing', () => {
  it('should hash a password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$argon2/);
  });

  it('should verify a correct password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    const valid = await verifyPassword('wrongPassword', hash);
    expect(valid).toBe(false);
  });
});
