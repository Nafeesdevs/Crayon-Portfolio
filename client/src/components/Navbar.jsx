import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Hand, Type, Square, PenTool, Menu, X } from 'lucide-react';

const LINKS = [
  { id: 'home', label: 'Home', icon: MousePointer2 },
  { id: 'about', label: 'About', icon: Hand },
  { id: 'skills', label: 'Skills', icon: PenTool },
  { id: 'work', label: 'Work', icon: Square },
  { id: 'contact', label: 'Contact', icon: Type },
];

export function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar({ profile }) {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    LINKS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (id) => { setOpen(false); scrollTo(id); };

  return (
    <>
      {/* Desktop: Figma-style floating toolbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-2xl border-[2.5px] border-ink bg-white/90 p-1.5 shadow-sticker backdrop-blur md:flex"
      >
        <button onClick={() => go('home')} className="mr-1 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 font-display text-sm font-bold text-paper">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-crayon-green" />
          {profile.name?.split(' ')[0] || 'me'}
        </button>
        {LINKS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => go(id)} className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium">
            {active === id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-crayon-yellow" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <Icon size={15} className="relative" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </motion.nav>

      {/* Mobile */}
      <div className="fixed inset-x-3 top-3 z-50 flex items-center justify-between rounded-2xl border-[2.5px] border-ink bg-white/90 px-3 py-2 shadow-sticker backdrop-blur md:hidden">
        <span className="font-display font-bold">{profile.name}</span>
        <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="rounded-lg bg-crayon-yellow p-1.5">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-crayon-yellow px-8 md:hidden"
          >
            {LINKS.map(({ id, label }, i) => (
              <motion.button
                key={id}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                onClick={() => go(id)}
                className="text-left font-display text-6xl font-extrabold"
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
