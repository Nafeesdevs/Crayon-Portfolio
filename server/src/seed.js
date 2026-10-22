// Fills the database with starter content so the site looks alive on day one.
// Run: npm run seed   (safe to re-run — it replaces profile, projects and experience)
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import Experience from './models/Experience.js';

await connectDB();

await Profile.deleteMany({});
await Profile.create({
  name: 'Your Name',
  role: 'Full-Stack Developer',
  location: 'Chennai, India',
  headline: 'I build things for the web that feel alive.',
  availability: 'Open to new work & good problems',
  openToWork: true,
  email: 'hello@example.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
    { label: 'Instagram', url: 'https://instagram.com/' },
  ],
  skills: [
    { name: 'React', emoji: '⚛️', level: 92 },
    { name: 'Node.js', emoji: '🟢', level: 88 },
    { name: 'MongoDB', emoji: '🍃', level: 82 },
    { name: 'Tailwind', emoji: '🌊', level: 90 },
    { name: 'UI Motion', emoji: '✨', level: 85 },
    { name: 'TypeScript', emoji: '🔷', level: 78 },
  ],
  stats: [
    { label: 'Projects shipped', value: '24+' },
    { label: 'Cups of chai', value: '∞' },
    { label: 'Years building', value: '3' },
  ],
  tools: ['VS Code', 'Figma', 'Git', 'Postman', 'Vercel', 'Docker'],
  marqueeWords: ['Design', 'Develop', 'Animate', 'Ship', 'Repeat'],
  funFacts: ['I debug best at 2am', 'Collector of weird fonts', 'Will refactor for fun'],
});

await Project.deleteMany({});
await Project.insertMany([
  { title: 'Wayfinder', tagline: 'A transit app that feels less like decoding a puzzle.', tags: ['React', 'Maps', 'Mobile'], color: '#3D7BFF', liveUrl: 'https://example.com', githubUrl: 'https://github.com/', featured: true, order: 0, date: new Date('2026-03-19') },
  { title: 'SplitJar', tagline: "From 'who owes who' to money that finally feels shared.", tags: ['Fintech', 'Node', 'MongoDB'], color: '#FFC93C', liveUrl: 'https://example.com', order: 1, date: new Date('2026-03-02') },
  { title: 'Kickstart', tagline: 'Day one to shipping — onboarding without the panic.', tags: ['Dev Tools', 'Express'], color: '#2EC4B6', liveUrl: 'https://example.com', order: 2, date: new Date('2026-01-02') },
  { title: 'Wattson', tagline: 'Helping people understand the energy they use at home.', tags: ['Data Viz', 'React'], color: '#FF5A5F', liveUrl: 'https://example.com', featured: true, order: 3, date: new Date('2026-03-16') },
]);

await Experience.deleteMany({});
await Experience.insertMany([
  { role: 'Full-Stack Developer', company: 'Studio Something', start: 'Jan 2025', current: true, description: 'Building MERN products end-to-end, from database design to buttery UI motion.', order: 0 },
  { role: 'Frontend Intern', company: 'Pixel & Co.', start: 'Jun 2024', end: 'Dec 2024', description: 'Shipped a design system and cut page load times by 40%.', order: 1 },
]);

console.log('✓ Seed complete');
await mongoose.disconnect();
