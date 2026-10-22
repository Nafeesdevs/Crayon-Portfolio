import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Reveal, SectionTitle } from './Reveal';
import { CRAYONS } from '../lib/api';

export default function About({ profile }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const words = (profile.bio || '').split(' ');

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionTitle kicker="what's up ✌️" title="About me" color="#8B5CF6" />
          {/* word-by-word reveal */}
          <p className="mt-12 font-display text-2xl font-medium leading-snug sm:text-3xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="mr-[0.25em] inline-block"
                initial={{ opacity: 0.12, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ delay: i * 0.025, duration: 0.4 }}
              >
                {w}
              </motion.span>
            ))}
          </p>

          {profile.funFacts?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {profile.funFacts.map((f, i) => (
                <Reveal key={f} delay={i * 0.08}>
                  <span className="chip font-hand text-xl" style={{ background: CRAYONS[(i + 2) % CRAYONS.length] + '33' }}>☆ {f}</span>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-[420px]">
          {/* sticky-note stats that float on scroll */}
          {(profile.stats || []).slice(0, 3).map((s, i) => (
            <motion.div
              key={s.label}
              style={{ y: i % 2 ? y2 : y1 }}
              className={`absolute ${['left-0 top-0', 'right-0 top-36', 'left-10 top-72'][i]}`}
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.06 }}
                initial={{ rotate: [-6, 5, -3][i] }}
                animate={{ rotate: [-6, 5, -3][i] }}
                className="sticker w-52 p-5"
                style={{ background: ['#FFC93C', '#FF8FAB', '#2EC4B6'][i] }}
              >
                <p className="font-display text-5xl font-extrabold">{s.value}</p>
                <p className="mt-1 font-hand text-2xl leading-6">{s.label}</p>
              </motion.div>
            </motion.div>
          ))}
          {!profile.stats?.length && <p className="font-hand text-2xl text-ink/50">Add stats from the admin panel ✏️</p>}
        </div>
      </div>
    </section>
  );
}
