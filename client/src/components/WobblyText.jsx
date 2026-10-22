import { motion } from 'framer-motion';
import { CRAYONS } from '../lib/api';

// Each letter springs in, and jumps / changes colour when hovered
export default function WobblyText({ text = '', delay = 0.4 }) {
  return (
    <span className="inline-flex overflow-hidden pb-2" aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: '110%', rotate: 12 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ delay: delay + i * 0.06, type: 'spring', stiffness: 140, damping: 14 }}
          whileHover={{ y: -18, rotate: i % 2 ? 8 : -8, color: CRAYONS[i % CRAYONS.length], transition: { type: 'spring', stiffness: 500, damping: 10 } }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}
