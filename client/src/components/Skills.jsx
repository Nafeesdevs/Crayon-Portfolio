import { motion } from 'framer-motion';
import { useRef } from 'react';
import { SectionTitle, Reveal } from './Reveal';
import { CRAYONS } from '../lib/api';

// Skills drawn as crayons: wrapper colour = skill, length = level. They can be tossed around.
function Crayon({ skill, color, i, constraints }) {
  const len = 45 + (Math.min(100, Math.max(10, skill.level || 70)) / 100) * 55;
  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragElastic={0.3}
      whileDrag={{ scale: 1.05, zIndex: 20 }}
      initial={{ x: -120, opacity: 0, rotate: -8 }}
      whileInView={{ x: 0, opacity: 1, rotate: i % 2 ? 1.5 : -1.5 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: 'spring', stiffness: 90, damping: 13 }}
      whileHover={{ x: 14 }}
      data-cursor="toss"
      className="relative flex h-16 touch-none items-center"
      style={{ width: `${len}%` }}
    >
      <div className="flex h-full flex-1 items-center gap-3 rounded-l-xl border-[2.5px] border-ink pl-4 shadow-sticker" style={{ background: color }}>
        <span className="text-2xl">{skill.emoji || '🖍️'}</span>
        <span className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">{skill.name}</span>
        <span className="ml-auto mr-3 hidden h-full w-px border-l-2 border-dashed border-ink/40 sm:block" />
        <span className="mr-4 font-mono text-sm font-semibold">{skill.level}%</span>
      </div>
      {/* crayon tip */}
      <svg viewBox="0 0 40 64" className="-ml-[2px] h-16 w-10 shrink-0">
        <path d="M1 2 L 38 26 Q 40 32 38 38 L 1 62 Z" fill={color} stroke="#17151C" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 17 L38 26 Q 40 32 38 38 L24 47 Z" fill="#17151C" opacity=".25" />
      </svg>
    </motion.div>
  );
}

export default function Skills({ profile }) {
  const box = useRef(null);
  const skills = profile.skills || [];
  return (
    <section id="skills" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="my crayon box 🖍️" title="Skills" color="#FF8A3D" />
          <p className="max-w-xs font-hand text-2xl text-ink/60">longer crayon = more confident. go on, drag one.</p>
        </div>

        <div ref={box} className="mt-14 flex flex-col gap-4">
          {skills.map((s, i) => (
            <Crayon key={s.name + i} skill={s} i={i} color={CRAYONS[i % CRAYONS.length]} constraints={box} />
          ))}
          {!skills.length && <p className="font-hand text-2xl text-ink/50">Add skills from the admin panel ✏️</p>}
        </div>

        {profile.tools?.length > 0 && (
          <Reveal className="mt-16">
            <p className="label">tools on my desk</p>
            <div className="flex flex-wrap gap-2.5">
              {profile.tools.map((t, i) => (
                <motion.span key={t} whileHover={{ y: -4, rotate: i % 2 ? 3 : -3 }} className="chip bg-white px-4 py-2 font-mono text-sm shadow-sticker">
                  {t}
                </motion.span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
