import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// Somente este modulo conhece o SQLite: ponto de adaptacao para outro banco.
export function openUsers(filename) {
  if (filename !== ':memory:') mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  )`);
  const find = db.prepare('SELECT * FROM users WHERE email = ?');
  const insert = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
  return {
    findByEmail: email => find.get(email),
    create: (name, email, hash) => insert.run(name, email, hash),
    close: () => db.close()
  };
}
