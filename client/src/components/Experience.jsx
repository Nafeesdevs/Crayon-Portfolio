import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SectionTitle } from './Reveal';
import { CRAYONS } from '../lib/api';

export default function Experience({ items = [] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="experience" className="relative bg-ink py-24 text-paper sm:py-32">
      <div className="container-x">
        <SectionTitle kicker="the journey so far 🛤️" title="Experience" color="#FFC93C" />
        <div ref={ref} className="relative mt-16 pl-10 sm:pl-16">
          <div className="absolute bottom-0 left-3 top-0 w-1 rounded bg-paper/15 sm:left-6" />
          <motion.div style={{ scaleY }} className="absolute bottom-0 left-3 top-0 w-1 origin-top rounded bg-crayon-yellow sm:left-6" />
          <div className="flex flex-col gap-12">
            {items.map((e, i) => (
              <motion.div
                key={e._id || i}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ type: 'spring', stiffness: 80, damping: 16 }}
                className="relative"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -left-[38px] top-2 h-6 w-6 rounded-full border-[3px] border-paper sm:-left-[50px]"
                  style={{ background: CRAYONS[i % CRAYONS.length] }}
                />
                <p className="font-mono text-sm text-paper/60">
                  {e.start} — {e.current ? <span className="text-crayon-green">present</span> : e.end}
                </p>
                <h3 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{e.role}</h3>
                <p className="font-serif text-2xl italic text-crayon-yellow">@ {e.company}</p>
                {e.description && <p className="mt-3 max-w-2xl text-paper/75">{e.description}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
