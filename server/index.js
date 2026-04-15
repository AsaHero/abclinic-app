import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './routes/auth.js';
import servicesRouter from './routes/services.js';
import categoriesRouter from './routes/categories.js';
import uploadRouter from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files as static assets
const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.cwd(), process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), 'public/uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
