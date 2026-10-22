import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollTo } from './Navbar';
import { CRAYONS } from '../lib/api';

export default function Footer({ profile }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const name = profile.name || 'Your Name';

  return (
    <footer className="relative overflow-hidden border-t-[2.5px] border-ink bg-paper pt-16">
      <div className="container-x flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-display text-xl font-bold">{name}</p>
          <p className="text-ink/60">{profile.role}</p>
        </div>
        <p className="font-mono text-sm text-ink/60">local time · {time}</p>
        <button onClick={() => scrollTo('home')} className="btn bg-white" data-cursor="up!">
          Back to top <ArrowUp size={18} />
        </button>
      </div>

      <div className="mt-12 flex select-none justify-center whitespace-nowrap px-2 leading-[0.8]">
        {name.split('').map((c, i) => (
          <motion.span
            key={i}
            whileHover={{ y: -30, color: CRAYONS[i % CRAYONS.length] }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="text-outline inline-block font-display text-[15vw] font-extrabold uppercase"
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        ))}
      </div>
      <p className="pb-6 text-center text-sm text-ink/50">© {new Date().getFullYear()} {name} · crafted with crayons & code</p>
    </footer>
  );
}
