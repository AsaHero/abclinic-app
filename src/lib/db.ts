import "server-only";
import Database from "better-sqlite3";
import path from "path";

// Same schema/file format as the old server/db.js — production's SQLite file
// (mounted at /data/services.db on the VPS, see docker-compose.server.yml)
// is a drop-in replacement for this file once deployed, no data migration
// needed.
const dbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(process.cwd(), "data", "services.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

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

  CREATE TABLE IF NOT EXISTS serviceGroups (
    id                   TEXT PRIMARY KEY,
    title                TEXT NOT NULL,
    tagline              TEXT,
    category             TEXT NOT NULL,
    serviceIds           TEXT NOT NULL,
    recommendedServiceId TEXT,
    sortOrder            INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,
    service     TEXT,
    message     TEXT,
    source      TEXT NOT NULL DEFAULT 'contact_form',
    status      TEXT NOT NULL DEFAULT 'new',
    createdAt   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id           TEXT PRIMARY KEY,
    firstName    TEXT NOT NULL,
    lastName     TEXT NOT NULL,
    role         TEXT NOT NULL,
    roleTitle    TEXT,
    photo        TEXT,
    bio          TEXT,
    education    TEXT,
    certificates TEXT,
    sortOrder    INTEGER DEFAULT 0,
    createdAt    TEXT DEFAULT (datetime('now')),
    updatedAt    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    excerpt     TEXT,
    content     TEXT,
    coverImage  TEXT,
    category    TEXT,
    published   INTEGER DEFAULT 0,
    publishedAt TEXT,
    createdAt   TEXT DEFAULT (datetime('now')),
    updatedAt   TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
