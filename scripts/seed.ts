// Run with: npx tsx scripts/seed.ts
// One-time: populates a fresh services.db with the real catalog recovered
// from git history (scripts/legacy-seed-data.ts) instead of leaving it
// empty. Safe to re-run — skips if the DB already has rows.

import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";
import { serviceCategories, allServices } from "./legacy-seed-data";

dotenv.config({ path: ".env.local" });
dotenv.config();

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
    process               TEXT,
    suitableFor          TEXT,
    faqs                 TEXT,
    beforeAfterImages    TEXT,
    serviceVideo         TEXT,
    galleryImages        TEXT,
    sortOrder            INTEGER DEFAULT 0,
    createdAt            TEXT DEFAULT (datetime('now')),
    updatedAt            TEXT DEFAULT (datetime('now'))
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
`);

const existingCategories = (db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number })
  .count;
const existingServices = (db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number })
  .count;

if (existingCategories > 0 || existingServices > 0) {
  console.log(`Database already seeded (${existingCategories} categories, ${existingServices} services). Skipping.`);
  console.log("To re-seed, delete the DB file (see DB_PATH) and run again.");
  process.exit(0);
}

const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (id, title, description, requiresConsultation, sortOrder)
  VALUES (@id, @title, @description, @requiresConsultation, @sortOrder)
`);

const insertService = db.prepare(`
  INSERT OR IGNORE INTO services (
    id, name, price, category, categories, description, detailedDescription,
    duration, heroImage, backgroundPosition, popular, isSpecialOffer,
    includesConsultation, requiresConsultation, benefits, process,
    suitableFor, faqs, beforeAfterImages, serviceVideo, galleryImages, sortOrder
  ) VALUES (
    @id, @name, @price, @category, @categories, @description, @detailedDescription,
    @duration, @heroImage, @backgroundPosition, @popular, @isSpecialOffer,
    @includesConsultation, @requiresConsultation, @benefits, @process,
    @suitableFor, @faqs, @beforeAfterImages, @serviceVideo, @galleryImages, @sortOrder
  )
`);

const seedAll = db.transaction(() => {
  serviceCategories
    .filter((cat) => cat.id !== "all")
    .forEach((cat, index) => {
      insertCategory.run({
        id: cat.id,
        title: cat.title,
        description: cat.description ?? null,
        requiresConsultation: cat.requiresConsultation ? 1 : 0,
        sortOrder: index,
      });
    });

  allServices.forEach((svc, index) => {
    insertService.run({
      id: svc.id,
      name: svc.name,
      price: svc.price,
      category: svc.category,
      categories: svc.categories ? JSON.stringify(svc.categories) : null,
      description: svc.description ?? null,
      detailedDescription: svc.detailedDescription ?? null,
      duration: svc.duration ?? null,
      heroImage: svc.heroImage ?? null,
      backgroundPosition: svc.backgroundPosition ?? null,
      popular: svc.popular ? 1 : 0,
      isSpecialOffer: svc.isSpecialOffer ? 1 : 0,
      includesConsultation: svc.includesConsultation ? 1 : 0,
      requiresConsultation: svc.requiresConsultation ? 1 : 0,
      benefits: svc.benefits ? JSON.stringify(svc.benefits) : null,
      process: svc.process ? JSON.stringify(svc.process) : null,
      suitableFor: svc.suitableFor ? JSON.stringify(svc.suitableFor) : null,
      faqs: svc.faqs ? JSON.stringify(svc.faqs) : null,
      beforeAfterImages: svc.beforeAfterImages ? JSON.stringify(svc.beforeAfterImages) : null,
      serviceVideo: svc.serviceVideo ?? null,
      galleryImages: svc.galleryImages ? JSON.stringify(svc.galleryImages) : null,
      sortOrder: index,
    });
  });
});

seedAll();

const catCount = (db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number }).count;
const svcCount = (db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number }).count;

console.log(`Seeded ${catCount} categories and ${svcCount} services into ${dbPath}`);
