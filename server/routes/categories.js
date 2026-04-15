import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function parseRow(row) {
  if (!row) return null;
  return {
    ...row,
    requiresConsultation: Boolean(row.requiresConsultation),
  };
}

// GET /api/categories
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY sortOrder, title').all();
  res.json(rows.map(parseRow));
});

// GET /api/categories/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Category not found' });
  res.json(parseRow(row));
});

// POST /api/categories  (auth required)
router.post('/', requireAuth, (req, res) => {
  const { id, title, description, requiresConsultation, sortOrder } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: 'id and title are required' });
  }

  db.prepare(`
    INSERT INTO categories (id, title, description, requiresConsultation, sortOrder)
    VALUES (@id, @title, @description, @requiresConsultation, @sortOrder)
  `).run({
    id,
    title,
    description: description ?? null,
    requiresConsultation: requiresConsultation ? 1 : 0,
    sortOrder: sortOrder ?? 0,
  });

  const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.status(201).json(parseRow(created));
});

// PUT /api/categories/:id  (auth required)
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  const { title, description, requiresConsultation, sortOrder } = req.body;

  db.prepare(`
    UPDATE categories SET
      title = @title, description = @description,
      requiresConsultation = @requiresConsultation, sortOrder = @sortOrder
    WHERE id = @id
  `).run({
    id: req.params.id,
    title: title ?? existing.title,
    description: description ?? existing.description,
    requiresConsultation: requiresConsultation !== undefined ? (requiresConsultation ? 1 : 0) : existing.requiresConsultation,
    sortOrder: sortOrder ?? existing.sortOrder,
  });

  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json(parseRow(updated));
});

// DELETE /api/categories/:id  (auth required)
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
  res.status(204).end();
});

export default router;
