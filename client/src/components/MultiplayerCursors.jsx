import { motion } from 'framer-motion';

const PEOPLE = [
  { name: 'Recruiter', color: '#8B5CF6', x: ['10vw', '35vw', '22vw', '10vw'], y: ['30vh', '45vh', '70vh', '30vh'], d: 14 },
  { name: 'Client', color: '#FF5A5F', x: ['70vw', '55vw', '80vw', '70vw'], y: ['65vh', '35vh', '50vh', '65vh'], d: 17 },
  { name: 'You?', color: '#2EC4B6', x: ['50vw', '60vw', '40vw', '50vw'], y: ['80vh', '60vh', '75vh', '80vh'], d: 12 },
];

// Fake "multiplayer" cursors drifting around like a live Figma file
export default function MultiplayerCursors() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden>
      {PEOPLE.map((p, i) => (
        <motion.div
          key={p.name}
          className="absolute left-0 top-0"
          initial={{ opacity: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 1 }}
          transition={{ x: { duration: p.d, repeat: Infinity, ease: 'easeInOut' }, y: { duration: p.d, repeat: Infinity, ease: 'easeInOut' }, opacity: { delay: 2 + i * 0.4 } }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill={p.color} stroke="#17151C" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          <span className="ml-4 rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: p.color }}>
            {p.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
