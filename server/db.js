import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(__dirname, 'services.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id                   TEXT PRIMARY KEY,
    title                TEXT NOT NULL,
    description          TEXT,
    requiresConsultation INTEGER DEFAULT 0,
    sortOrder            INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS services (
    id                   TEXT PRIMARY KEY,
    name                 TEXT NOT NULL,
    price                INTEGER NOT NULL,
    category             TEXT NOT NULL,
    categories           TEXT,
    description          TEXT,
    detailedDescription  TEXT,
    duration             TEXT,
    heroImage            TEXT,
    backgroundPosition   TEXT,
    popular              INTEGER DEFAULT 0,
    isSpecialOffer       INTEGER DEFAULT 0,
    includesConsultation INTEGER DEFAULT 0,
    requiresConsultation INTEGER DEFAULT 0,
    benefits             TEXT,
    process              TEXT,
    suitableFor          TEXT,
    faqs                 TEXT,
    beforeAfterImages    TEXT,
    serviceVideo         TEXT,
    galleryImages        TEXT,
    sortOrder            INTEGER DEFAULT 0,
    createdAt            TEXT DEFAULT (datetime('now')),
    updatedAt            TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
