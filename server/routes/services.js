import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// JSON columns to parse back into objects
const JSON_COLS = [
  'categories', 'benefits', 'process', 'suitableFor',
  'faqs', 'beforeAfterImages', 'galleryImages',
];

function parseRow(row) {
  if (!row) return null;
  const parsed = { ...row };
  for (const col of JSON_COLS) {
    if (parsed[col]) {
      try { parsed[col] = JSON.parse(parsed[col]); } catch { /* leave as string */ }
    }
  }
  // SQLite stores booleans as 0/1
  parsed.popular = Boolean(parsed.popular);
  parsed.isSpecialOffer = Boolean(parsed.isSpecialOffer);
  parsed.includesConsultation = Boolean(parsed.includesConsultation);
  parsed.requiresConsultation = Boolean(parsed.requiresConsultation);
  return parsed;
}

// GET /api/services  (optional ?category=xxx)
router.get('/', (req, res) => {
  const { category } = req.query;
  let rows;
  if (category && category !== 'all') {
    rows = db.prepare(
      `SELECT * FROM services
       WHERE category = ? OR (categories IS NOT NULL AND categories LIKE ?)
       ORDER BY sortOrder, name`
    ).all(category, `%"${category}"%`);
  } else {
    rows = db.prepare('SELECT * FROM services ORDER BY sortOrder, name').all();
  }
  res.json(rows.map(parseRow));
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Service not found' });
  res.json(parseRow(row));
});

// POST /api/services  (auth required)
router.post('/', requireAuth, (req, res) => {
  const svc = req.body;
  if (!svc.id || !svc.name || svc.price === undefined || !svc.category) {
    return res.status(400).json({ error: 'id, name, price, and category are required' });
  }

  db.prepare(`
    INSERT INTO services (
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
  `).run(serializeRow(svc));

  const created = db.prepare('SELECT * FROM services WHERE id = ?').get(svc.id);
  res.status(201).json(parseRow(created));
});

// PUT /api/services/:id  (auth required)
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Service not found' });

  const merged = { ...parseRow(existing), ...req.body, id: req.params.id };

  db.prepare(`
    UPDATE services SET
      name = @name, price = @price, category = @category, categories = @categories,
      description = @description, detailedDescription = @detailedDescription,
      duration = @duration, heroImage = @heroImage, backgroundPosition = @backgroundPosition,
      popular = @popular, isSpecialOffer = @isSpecialOffer,
      includesConsultation = @includesConsultation, requiresConsultation = @requiresConsultation,
      benefits = @benefits, process = @process, suitableFor = @suitableFor,
      faqs = @faqs, beforeAfterImages = @beforeAfterImages, serviceVideo = @serviceVideo,
      galleryImages = @galleryImages, sortOrder = @sortOrder,
      updatedAt = datetime('now')
    WHERE id = @id
  `).run(serializeRow(merged));

  const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  res.json(parseRow(updated));
});

// DELETE /api/services/:id  (auth required)
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Service not found' });
  res.status(204).end();
});

function serializeRow(svc) {
  return {
    id: svc.id,
    name: svc.name,
    price: svc.price,
    category: svc.category,
    categories: Array.isArray(svc.categories) ? JSON.stringify(svc.categories) : svc.categories ?? null,
    description: svc.description ?? null,
    detailedDescription: svc.detailedDescription ?? null,
    duration: svc.duration ?? null,
    heroImage: svc.heroImage ?? null,
    backgroundPosition: svc.backgroundPosition ?? null,
    popular: svc.popular ? 1 : 0,
    isSpecialOffer: svc.isSpecialOffer ? 1 : 0,
    includesConsultation: svc.includesConsultation ? 1 : 0,
    requiresConsultation: svc.requiresConsultation ? 1 : 0,
    benefits: Array.isArray(svc.benefits) ? JSON.stringify(svc.benefits) : svc.benefits ?? null,
    process: Array.isArray(svc.process) ? JSON.stringify(svc.process) : svc.process ?? null,
    suitableFor: Array.isArray(svc.suitableFor) ? JSON.stringify(svc.suitableFor) : svc.suitableFor ?? null,
    faqs: Array.isArray(svc.faqs) ? JSON.stringify(svc.faqs) : svc.faqs ?? null,
    beforeAfterImages: Array.isArray(svc.beforeAfterImages) ? JSON.stringify(svc.beforeAfterImages) : svc.beforeAfterImages ?? null,
    serviceVideo: svc.serviceVideo ?? null,
    galleryImages: Array.isArray(svc.galleryImages) ? JSON.stringify(svc.galleryImages) : svc.galleryImages ?? null,
    sortOrder: svc.sortOrder ?? 0,
  };
}

export default router;
