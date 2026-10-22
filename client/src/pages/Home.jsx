import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { api } from '../lib/api';
import Preloader from '../components/Preloader';
import Cursor from '../components/Cursor';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';

const FALLBACK = { name: 'Your Name', role: 'Developer', socials: [], skills: [], stats: [], tools: [], marqueeWords: [], funFacts: [] };

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], experience: [] });
  const [loading, setLoading] = useState(true);
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 1800);
    Promise.allSettled([api.get('/profile'), api.get('/projects'), api.get('/experience')]).then(([p, pr, ex]) => {
      setData({
        profile: p.status === 'fulfilled' ? p.value.data : FALLBACK,
        projects: pr.status === 'fulfilled' ? pr.value.data : [],
        experience: ex.status === 'fulfilled' ? ex.value.data : [],
      });
      setLoading(false);
    });
    return () => clearTimeout(t);
  }, []);

  const showLoader = loading || !minTimeDone;

  useEffect(() => {
    if (showLoader) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, [showLoader]);

  useEffect(() => {
    if (data.profile?.name) document.title = `${data.profile.name} — ${data.profile.role || 'Portfolio'}`;
  }, [data.profile]);

  const profile = data.profile || FALLBACK;

  return (
    <div className="grain relative">
      <AnimatePresence>{showLoader && <Preloader key="pre" name={profile.name} />}</AnimatePresence>
      <Cursor />
      {!showLoader && (
        <>
          <ScrollProgress />
          <Navbar profile={profile} />
          <main>
            <Hero profile={profile} />
            <Marquee words={profile.marqueeWords} />
            <About profile={profile} />
            <Skills profile={profile} />
            <Projects projects={data.projects} />
            {data.experience.length > 0 && <Experience items={data.experience} />}
            <Contact profile={profile} />
          </main>
          <Footer profile={profile} />
        </>
      )}
    </div>
  );
}
