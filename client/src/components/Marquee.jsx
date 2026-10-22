import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function Strip({ words, className, reverse, speed }) {
  const list = [...words, ...words, ...words, ...words];
  return (
    <div className={`flex overflow-hidden border-y-[2.5px] border-ink py-3 ${className}`}>
      <div className={`flex shrink-0 ${speed}`} style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {list.map((w, i) => (
              <span key={i} className="mx-6 flex items-center gap-6 font-display text-3xl font-extrabold uppercase sm:text-5xl">
                {w} <span className="text-2xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Two crossing "tape" strips that tilt as you scroll
export default function Marquee({ words = [] }) {
  const ref = useRef(null);
  const w = words.length ? words : ['Design', 'Develop', 'Animate', 'Ship'];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const r1 = useTransform(scrollYProgress, [0, 1], [-1, -5]);
  const r2 = useTransform(scrollYProgress, [0, 1], [3, 6]);

  return (
    <section ref={ref} className="relative overflow-hidden py-16" aria-hidden>
      <motion.div style={{ rotate: r1 }} className="relative z-10 -mx-10">
        <Strip words={w} className="bg-crayon-yellow" speed="animate-marquee" />
      </motion.div>
      <motion.div style={{ rotate: r2 }} className="-mx-10 -mt-12">
        <Strip words={w} className="bg-ink text-paper" speed="animate-marquee-fast" reverse />
      </motion.div>
    </section>
  );
}
