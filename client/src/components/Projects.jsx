import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionTitle } from './Reveal';
import ProjectCard from './ProjectCard';

export default function Projects({ projects = [] }) {
  const [tag, setTag] = useState('All');
  const tags = useMemo(() => ['All', ...new Set(projects.flatMap((p) => p.tags || []))], [projects]);
  const list = tag === 'All' ? projects : projects.filter((p) => p.tags?.includes(tag));

  return (
    <section id="work" className="canvas-dots relative py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="explore my work! 👇" title="Featured works" color="#3D7BFF" />
          <p className="max-w-sm font-hand text-2xl text-ink/60">tap any card to visit the live project ↗</p>
        </div>

        {tags.length > 2 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t} onClick={() => setTag(t)} className="relative rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold">
                {tag === t && <motion.span layoutId="tag-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className={`relative ${tag === t ? 'text-paper' : ''}`}>{t}</span>
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p._id || p.title} layout exit={{ opacity: 0, scale: 0.8 }} className={p.featured ? 'md:col-span-2' : ''}>
                <ProjectCard project={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!projects.length && (
          <div className="sticker mt-14 p-10 text-center">
            <p className="font-hand text-3xl">No projects yet — add your first one from /admin ✏️</p>
          </div>
        )}
      </div>
    </section>
  );
}
