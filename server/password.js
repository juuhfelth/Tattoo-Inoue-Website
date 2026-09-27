import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);

// Scrypt da biblioteca criptografica do Node; cada senha recebe seu proprio salt.
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  const [, salt, hash] = stored.split(':');
  const key = await derive(password, salt, 64);
  return timingSafeEqual(key, Buffer.from(hash, 'hex'));
}
