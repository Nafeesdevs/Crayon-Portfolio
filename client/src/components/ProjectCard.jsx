import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import CoverArt from './CoverArt';
import { asset } from '../lib/api';

export default function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 18 });
  const rY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.55), transparent 45%)`;

  const link = project.liveUrl || project.githubUrl;
  const tilt = [-2, 1.5, -1, 2][index % 4];
  const featured = project.featured;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };
  const open = () => link && window.open(link, '_blank', 'noopener,noreferrer');

  const date = project.date ? new Date(project.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 80, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 70, damping: 15, delay: (index % 2) * 0.1 }}
      className="group [perspective:1200px]"
    >
      <motion.div
        ref={ref}
        role="link"
        tabIndex={0}
        aria-label={`Open ${project.title}`}
        onClick={open}
        onKeyDown={(e) => e.key === 'Enter' && open()}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor={link ? 'visit ↗' : 'soon'}
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer rounded-[28px] border-[2.5px] border-ink bg-white p-3 shadow-stickerLg transition-shadow duration-300 hover:shadow-[14px_14px_0_0_#17151C] sm:p-4"
      >
        <div className="tape -top-3.5 left-8 rotate-[-6deg]" style={{ background: project.color }} />
        <div className="tape -top-3.5 right-8 rotate-[5deg] bg-crayon-yellow" />

        <div className={`relative overflow-hidden rounded-[18px] border-2 border-ink ${featured ? 'aspect-[16/8]' : 'aspect-[4/3]'}`} style={{ transform: 'translateZ(30px)' }}>
          <motion.div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]">
            {project.image ? (
              <img src={asset(project.image)} alt={project.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <CoverArt title={project.title} color={project.color} />
            )}
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glare }} />

          {/* visit badge rolls in on hover */}
          {link && (
            <div className="absolute right-4 top-4 flex h-14 w-14 translate-y-[-120%] rotate-[-90deg] items-center justify-center rounded-full border-[2.5px] border-ink bg-crayon-yellow shadow-sticker transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:translate-y-0 group-hover:rotate-0">
              <ArrowUpRight size={24} />
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-xs font-semibold">
            Project {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-col gap-3 px-2 pb-2 pt-5 sm:flex-row sm:items-end sm:justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-3xl font-extrabold sm:text-4xl">{project.title}</h3>
              {featured && <span className="chip bg-crayon-pink text-xs">★ featured</span>}
            </div>
            <p className="mt-1 max-w-lg text-ink/70">{project.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags?.map((t) => (
                <span key={t} className="rounded-full border-2 border-ink/80 px-2.5 py-0.5 text-xs font-semibold" style={{ background: project.color + '22' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {date && <span className="font-hand text-xl text-ink/50">{date}</span>}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                data-cursor="code"
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white transition hover:bg-ink hover:text-white"
                aria-label="Source code"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
