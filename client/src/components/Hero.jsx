import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { MapPin, ArrowDownRight, Sparkles } from 'lucide-react';
import WobblyText from './WobblyText';
import MultiplayerCursors from './MultiplayerCursors';
import Magnetic from './Magnetic';
import { scrollTo } from './Navbar';
import { asset } from '../lib/api';

function Sticker({ children, className = '', rotate = 0, delay = 0, constraints }) {
  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 40, cursor: 'grabbing' }}
      whileHover={{ scale: 1.04, rotate: rotate * -0.5 }}
      initial={{ scale: 0, rotate: rotate - 30, opacity: 0 }}
      animate={{ scale: 1, rotate, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 160, damping: 14 }}
      data-cursor="drag"
      className={`absolute z-20 touch-none select-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Stamp({ text }) {
  const t = `${text} • ${text} • `;
  return (
    <div className="relative grid h-28 w-28 place-items-center rounded-full border-[2.5px] border-ink bg-crayon-green shadow-sticker sm:h-32 sm:w-32">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
        <defs><path id="circ" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
        <text className="fill-ink font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em]">
          <textPath href="#circ">{t}</textPath>
        </text>
      </svg>
      <Sparkles className="text-ink" size={26} />
    </div>
  );
}

export default function Hero({ profile }) {
  const area = useRef(null);
  const first = (profile.name || 'Your Name').split(' ')[0];
  const rest = (profile.name || '').split(' ').slice(1).join(' ');

  // mouse parallax for the background blobs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const bx1 = useTransform(sx, (v) => v * 40);
  const by1 = useTransform(sy, (v) => v * 40);
  const bx2 = useTransform(sx, (v) => v * -60);
  const by2 = useTransform(sy, (v) => v * -60);

  useEffect(() => {
    const f = (e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); };
    window.addEventListener('mousemove', f);
    return () => window.removeEventListener('mousemove', f);
  }, [mx, my]);

  const { scrollYProgress } = useScroll({ target: area, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={area} className="canvas-dots relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28">
      <motion.div style={{ x: bx1, y: by1 }} className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-crayon-pink/40 blur-3xl" />
      <motion.div style={{ x: bx2, y: by2 }} className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-crayon-blue/25 blur-3xl" />
      <MultiplayerCursors />

      <motion.div style={{ opacity: fade }} className="container-x relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-end gap-3">
          <p className="font-hand text-3xl text-ink/80 sm:text-4xl">hi there 👋 my name is</p>
          <svg viewBox="0 0 120 60" className="mb-[-26px] hidden w-24 sm:block">
            <motion.path d="M5 10 C 40 0, 80 10, 95 45" fill="none" stroke="#FF5A5F" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
            <motion.path d="M82 40 L96 48 L100 32" fill="none" stroke="#FF5A5F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.3 }} />
          </svg>
        </motion.div>

        {/* Figma selection frame around the name */}
        <motion.div style={{ y: nameY }} className="relative mt-4 inline-block">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="pointer-events-none absolute -inset-x-3 -inset-y-2 border-2 border-crayon-blue sm:-inset-x-5"
          >
            {['-left-1.5 -top-1.5', '-right-1.5 -top-1.5', '-left-1.5 -bottom-1.5', '-right-1.5 -bottom-1.5'].map((p) => (
              <span key={p} className={`absolute h-3 w-3 border-2 border-crayon-blue bg-white ${p}`} />
            ))}
            <span className="absolute -top-7 left-0 rounded bg-crayon-blue px-2 py-0.5 font-mono text-[11px] text-white">Frame · {first.toLowerCase()}.tsx</span>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded bg-crayon-blue px-2 py-0.5 font-mono text-[11px] text-white">Hug × Fill</span>
          </motion.div>
          <h1 className="font-display text-[22vw] font-extrabold uppercase leading-[0.82] tracking-tight sm:text-[17vw] lg:text-[13.5rem]">
            <WobblyText text={first} />
          </h1>
        </motion.div>
        {rest && (
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="text-outline mt-4 font-display text-5xl font-extrabold uppercase sm:text-7xl">
            {rest}
          </motion.p>
        )}

        <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <p className="font-serif text-3xl italic sm:text-4xl">{profile.role}</p>
            <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold leading-tight sm:text-3xl">{profile.headline}</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <button onClick={() => scrollTo('work')} className="btn bg-crayon-yellow" data-cursor="go!">
                  See my work <ArrowDownRight size={18} />
                </button>
              </Magnetic>
              <Magnetic>
                <button onClick={() => scrollTo('contact')} className="btn bg-white">Say hi</button>
              </Magnetic>
              {profile.resumeUrl && (
                <Magnetic>
                  <a href={asset(profile.resumeUrl)} target="_blank" rel="noopener noreferrer" className="btn bg-crayon-pink" data-cursor="cv">Resume ↗</a>
                </Magnetic>
              )}
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} className="hidden font-hand text-2xl text-ink/60 md:block md:text-right">
            psst… everything colourful up here is draggable ↗
          </motion.p>
        </div>
      </motion.div>

      {/* Draggable stickers */}
      <Sticker constraints={area} rotate={6} delay={1.2} className="right-[4%] top-[14%] sm:right-[8%]">
        <div className="sticker w-36 bg-white p-2 pb-6 sm:w-44">
          <div className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg] bg-crayon-yellow" />
          {profile.avatar ? (
            <img src={asset(profile.avatar)} alt={profile.name} draggable={false} className="aspect-square w-full rounded-lg object-cover" />
          ) : (
            <div className="grid aspect-square w-full place-items-center rounded-lg bg-gradient-to-br from-crayon-pink to-crayon-orange text-6xl">😎</div>
          )}
          <p className="mt-2 text-center font-hand text-xl">that's me!</p>
        </div>
      </Sticker>

      {profile.openToWork && (
        <Sticker constraints={area} rotate={-8} delay={1.4} className="bottom-[10%] right-[6%] hidden sm:block lg:right-[30%]">
          <Stamp text="open to work" />
        </Sticker>
      )}

      <Sticker constraints={area} rotate={-5} delay={1.55} className="right-[30%] top-[18%] hidden lg:block">
        <div className="sticker flex items-center gap-1.5 bg-crayon-blue px-4 py-2 font-display font-semibold text-white">
          <MapPin size={16} /> {profile.location}
        </div>
      </Sticker>

      <Sticker constraints={area} rotate={4} delay={1.7} className="bottom-[22%] right-[4%] hidden w-52 md:block">
        <div className="sticker rounded-md bg-crayon-yellow p-4 font-hand text-2xl leading-6">{profile.availability}</div>
      </Sticker>

      {['🎨', '🚀', '✨'].map((e, i) => (
        <Sticker key={e} constraints={area} rotate={[-12, 10, -4][i]} delay={1.8 + i * 0.1} className={['left-[45%] top-[12%]', 'left-[6%] bottom-[6%] hidden sm:block', 'right-[44%] bottom-[30%] hidden lg:block'][i]}>
          <span className="block text-5xl drop-shadow-[3px_3px_0_#17151C]">{e}</span>
        </Sticker>
      ))}
    </section>
  );
}
