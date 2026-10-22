import { Router } from 'express';
import Profile from '../models/Profile.js';
import { requireAuth, ah } from '../middleware/auth.js';

const r = Router();

r.get('/', ah(async (_req, res) => res.json(await Profile.getSingleton())));

r.put(
  '/',
  requireAuth,
  ah(async (req, res) => {
    const doc = await Profile.getSingleton();
    const { _id, createdAt, updatedAt, __v, ...data } = req.body || {};
    doc.set(data);
    await doc.save();
    res.json(doc);
  })
);

export default r;
