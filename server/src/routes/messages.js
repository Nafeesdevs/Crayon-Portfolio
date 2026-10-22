import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { requireAuth, ah } from '../middleware/auth.js';

const r = Router();
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, message: { message: 'Too many messages, try again later' } });

r.post(
  '/',
  contactLimiter,
  ah(async (req, res) => {
    const { name, email, subject, body, website } = req.body || {};
    if (website) return res.status(201).json({ ok: true }); // honeypot for bots
    if (!name || !email || !body) return res.status(400).json({ message: 'Name, email and message are required' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email' });
    await Message.create({ name, email, subject, body });
    res.status(201).json({ ok: true });
  })
);

r.get('/', requireAuth, ah(async (_req, res) => res.json(await Message.find().sort({ createdAt: -1 }))));
r.get('/unread-count', requireAuth, ah(async (_req, res) => res.json({ count: await Message.countDocuments({ read: false }) })));

r.patch(
  '/:id',
  requireAuth,
  ah(async (req, res) => {
    const doc = await Message.findByIdAndUpdate(req.params.id, { read: !!req.body?.read }, { new: true });
    res.json(doc);
  })
);

r.delete('/:id', requireAuth, ah(async (req, res) => { await Message.findByIdAndDelete(req.params.id); res.json({ ok: true }); }));

export default r;
