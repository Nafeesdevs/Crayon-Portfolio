import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// Custom cursor: a dot + a lagging ring that grows and shows a label over elements with data-cursor="label"
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const [label, setLabel] = useState('');
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.body.classList.add('has-cursor');
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target.closest?.('[data-cursor], a, button, input, textarea, select');
      setHover(!!el);
      setLabel(el?.getAttribute?.('data-cursor') || '');
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;
  const big = !!label;

  return (
    <>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ x, y }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[89] flex items-center justify-center rounded-full border-2 border-ink"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: big ? 96 : hover ? 54 : 34,
          height: big ? 96 : hover ? 54 : 34,
          backgroundColor: big ? '#FFC93C' : hover ? 'rgba(255,201,60,.35)' : 'rgba(255,201,60,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <AnimatePresence>
          {big && (
            <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="font-display text-sm font-bold text-ink">
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
