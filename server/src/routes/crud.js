import { Router } from 'express';
import { requireAuth, ah } from '../middleware/auth.js';

/**
 * Generic CRUD router used for projects and experience.
 * Public:  GET /           → published items, sorted
 * Admin:   GET /all, POST /, PUT /reorder, PUT /:id, DELETE /:id
 */
export function crudRouter(Model, { publicFilter = {}, sort = { order: 1, createdAt: -1 } } = {}) {
  const r = Router();
  const clean = ({ _id, createdAt, updatedAt, __v, ...rest } = {}) => rest;

  r.get('/', ah(async (_req, res) => res.json(await Model.find(publicFilter).sort(sort))));
  r.get('/all', requireAuth, ah(async (_req, res) => res.json(await Model.find().sort(sort))));

  r.post(
    '/',
    requireAuth,
    ah(async (req, res) => {
      const count = await Model.countDocuments();
      const doc = await Model.create({ order: count, ...clean(req.body) });
      res.status(201).json(doc);
    })
  );

  r.put(
    '/reorder',
    requireAuth,
    ah(async (req, res) => {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
      await Promise.all(ids.map((id, i) => Model.updateOne({ _id: id }, { order: i })));
      res.json({ ok: true });
    })
  );

  r.put(
    '/:id',
    requireAuth,
    ah(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    })
  );

  r.delete(
    '/:id',
    requireAuth,
    ah(async (req, res) => {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    })
  );

  return r;
}
