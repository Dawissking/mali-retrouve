import * as argon2 from 'argon2';
import { config } from '../config';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: config.argon2.timeCost,
    memoryCost: config.argon2.memoryCost,
    parallelism: config.argon2.parallelism,
    hashLength: config.argon2.hashLength,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
