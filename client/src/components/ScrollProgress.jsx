import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-1.5 origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg,#FF5A5F,#FFC93C,#2EC4B6,#3D7BFF,#8B5CF6)' }}
    />
  );
}
