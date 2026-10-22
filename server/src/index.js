import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import User from './models/User.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import messageRoutes from './routes/messages.js';
import { crudRouter } from './routes/crud.js';
import { uploadRouter } from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn('⚠  JWT_SECRET not set — using an insecure dev secret. Set it in server/.env');
  process.env.JWT_SECRET = 'dev-only-insecure-secret';
}

const app = express();
app.set('trust proxy', 1);

const origins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: '2mb' }));

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', crudRouter(Project, { publicFilter: { published: true }, sort: { order: 1, date: -1 } }));
app.use('/api/experience', crudRouter(Experience));
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRouter(uploadDir));
app.use('/api', (_req, res) => res.status(404).json({ message: 'Route not found' }));

// In production, serve the built React app from client/dist
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'MulterError' ? 400 : err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

async function bootstrap() {
  await connectDB();

  if ((await User.countDocuments()) === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    await User.create({ email, password });
    console.log(`✓ Admin created → ${email} (change the password after first login)`);
  }
  await Profile.getSingleton();

  app.listen(PORT, () => console.log(`✓ API running on http://localhost:${PORT}`));
}

bootstrap().catch((e) => {
  console.error('✗ Failed to start:', e.message);
  process.exit(1);
});
