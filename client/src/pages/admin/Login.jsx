import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { errMsg } from '../../lib/api';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      nav('/admin');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="canvas-dots grid min-h-screen place-items-center px-4">
      <motion.form
        onSubmit={submit}
        initial={{ y: 40, opacity: 0, rotate: -3 }}
        animate={{ y: 0, opacity: 1, rotate: -1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="sticker relative w-full max-w-sm bg-white p-8"
      >
        <div className="tape -top-3.5 left-1/2 -translate-x-1/2 bg-crayon-yellow" />
        <p className="font-hand text-3xl text-crayon-red">psst, owner only</p>
        <h1 className="font-display text-4xl font-extrabold">Admin login</h1>
        <label className="label mt-8">Email</label>
        <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label mt-4">Password</label>
        <input className="field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={busy} className="btn mt-8 w-full bg-crayon-yellow disabled:opacity-60">{busy ? 'Checking…' : 'Log in'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-ink/60 underline">← back to site</Link>
      </motion.form>
    </div>
  );
}
