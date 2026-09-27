import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const config = {
  port: Number(process.env.PORT || 3000),
  databasePath: path.resolve(root, process.env.DATABASE_PATH || 'data/tattoo.sqlite'),
  sessionSecret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
  cookieName: 'tattoo.sid',
  cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000, path: '/' }
};
