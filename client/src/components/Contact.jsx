import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errMsg } from '../lib/api';
import { SectionTitle, Reveal } from './Reveal';
import Magnetic from './Magnetic';

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '', website: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/messages', form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', body: '', website: '' });
      toast.success('Message sent — talk soon!');
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSending(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  const input = 'w-full rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3.5 text-base outline-none transition focus:-translate-y-0.5 focus:shadow-sticker';

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <div>
          <SectionTitle kicker="got a project? ✉️" title="Let's talk" color="#2EC4B6" />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-md text-lg text-ink/70">Got a project, a hard problem, or just want to say hi? Send it over — I read every message.</p>
          </Reveal>
          {profile.email && (
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href={`mailto:${profile.email}`} className="btn bg-crayon-green" data-cursor="mail">
                    <Mail size={18} /> {profile.email}
                  </a>
                </Magnetic>
                <button onClick={copy} className="grid h-12 w-12 place-items-center rounded-full border-[2.5px] border-ink bg-white shadow-sticker" aria-label="Copy email">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </Reveal>
          )}
          <div className="mt-8 flex flex-wrap gap-2">
            {profile.socials?.map((s, i) => (
              <Reveal key={s.label} delay={0.25 + i * 0.05}>
                <motion.a whileHover={{ y: -4, rotate: -3 }} href={s.url} target="_blank" rel="noopener noreferrer" className="chip bg-white px-4 py-2 shadow-sticker">
                  {s.label} ↗
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <form onSubmit={submit} className="sticker relative rotate-[0.6deg] bg-crayon-yellow p-6 sm:p-8">
            <div className="tape -top-3.5 left-1/2 -translate-x-1/2 rotate-[-3deg] bg-crayon-pink" />
            <p className="mb-6 font-hand text-3xl">drop a line ✏️</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Your name" value={form.name} onChange={set('name')} className={input} />
              <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className={input} />
            </div>
            <input placeholder="Subject" value={form.subject} onChange={set('subject')} className={`${input} mt-4`} />
            <textarea required rows={5} placeholder="Tell me about it…" value={form.body} onChange={set('body')} className={`${input} mt-4 resize-none`} />
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden />
            <button disabled={sending} className="btn mt-6 w-full bg-ink text-paper disabled:opacity-60" data-cursor="send">
              <AnimatePresence mode="wait">
                <motion.span key={sent ? 's' : sending ? 'l' : 'i'} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-2">
                  {sent ? <>Sent! <Check size={18} /></> : sending ? 'Sending…' : <>Send message <Send size={18} /></>}
                </motion.span>
              </AnimatePresence>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
