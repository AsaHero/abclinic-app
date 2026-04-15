import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token });
});

export default router;
