import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { requireAuth, signToken, ah } from '../middleware/auth.js';

const r = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { message: 'Too many attempts, try later' } });

r.post(
  '/login',
  loginLimiter,
  ah(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.compare(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user), user: { id: user._id, email: user.email, name: user.name } });
  })
);

r.get(
  '/me',
  requireAuth,
  ah(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, email: user.email, name: user.name });
  })
);

r.put(
  '/password',
  requireAuth,
  ah(async (req, res) => {
    const { currentPassword, newPassword, email } = req.body || {};
    const user = await User.findById(req.user.id).select('+password');
    if (!user || !(await user.compare(currentPassword || ''))) return res.status(401).json({ message: 'Current password is wrong' });
    if (email) user.email = email;
    if (newPassword) {
      if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
      user.password = newPassword;
    }
    await user.save();
    res.json({ message: 'Account updated' });
  })
);

export default r;
