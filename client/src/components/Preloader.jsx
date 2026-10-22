import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= 100 ? 100 : v + Math.ceil(Math.random() * 9))), 70);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <svg viewBox="0 0 300 120" className="w-64 sm:w-80">
        <motion.path
          d="M20 80 C 50 10, 80 10, 90 60 S 130 110, 150 60 S 190 0, 210 60 S 260 100, 280 40"
          fill="none"
          stroke="#FFC93C"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <motion.circle cx="280" cy="40" r="9" fill="#FF5A5F" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3, type: 'spring' }} />
      </svg>
      <p className="mt-6 font-hand text-3xl">sharpening the crayons…</p>
      <span className="absolute bottom-8 right-8 font-display text-7xl font-extrabold tabular-nums sm:text-9xl">{Math.min(n, 100)}</span>
    </motion.div>
  );
}
