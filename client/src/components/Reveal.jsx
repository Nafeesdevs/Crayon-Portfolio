import { motion } from 'framer-motion';

export function Reveal({ children, delay = 0, y = 40, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Section heading: handwritten kicker + huge title with a scribble underline that draws in
export function SectionTitle({ kicker, title, color = '#FF5A5F', align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <Reveal>
        <p className="font-hand text-3xl" style={{ color }}>{kicker}</p>
      </Reveal>
      <div className={`relative mt-1 inline-block ${align === 'center' ? 'mx-auto' : ''}`}>
        <motion.h2
          initial={{ opacity: 0, y: 60, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          className="font-display text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl lg:text-8xl"
        >
          {title}
        </motion.h2>
        <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute -bottom-4 left-0 h-5 w-full">
          <motion.path
            d="M4 16 C 80 4, 160 22, 240 10 S 360 6, 396 14"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </div>
  );
}
