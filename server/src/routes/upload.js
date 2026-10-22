import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';

export function uploadRouter(uploadDir) {
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.png';
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = /^(image\/(png|jpe?g|webp|gif|avif|svg\+xml)|application\/pdf)$/.test(file.mimetype);
      cb(ok ? null : new Error('Only images or PDF allowed'), ok);
    },
  });

  const r = Router();
  r.post('/', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
  return r;
}
