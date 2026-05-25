import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`);

const { c } = db.prepare('SELECT COUNT(*) AS c FROM categories').get() as { c: number };
if (c === 0) {
  const insert = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const seed = db.transaction((names: string[]) => {
    for (const name of names) insert.run(name);
  });
  seed(['Work', 'Personal', 'Shopping', 'Health', 'Study']);
}

export const MAX_TODOS_PER_CATEGORY = 5;
