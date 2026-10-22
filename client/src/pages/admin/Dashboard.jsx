import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Mail, Briefcase, Plus, User } from 'lucide-react';
import { api } from '../../lib/api';
import { PageHeader, Card } from './ui';

export default function Dashboard() {
  const [s, setS] = useState({ projects: 0, published: 0, messages: 0, unread: 0, experience: 0, name: '' });

  useEffect(() => {
    Promise.all([api.get('/projects/all'), api.get('/messages'), api.get('/experience/all'), api.get('/profile')]).then(([p, m, e, pr]) => {
      setS({
        projects: p.data.length,
        published: p.data.filter((x) => x.published).length,
        messages: m.data.length,
        unread: m.data.filter((x) => !x.read).length,
        experience: e.data.length,
        name: pr.data.name,
      });
    }).catch(() => {});
  }, []);

  const tiles = [
    { label: 'Projects', value: s.projects, sub: `${s.published} live on site`, icon: FolderKanban, color: '#FFC93C', to: '/admin/projects' },
    { label: 'Messages', value: s.messages, sub: `${s.unread} unread`, icon: Mail, color: '#FF8FAB', to: '/admin/messages' },
    { label: 'Experience', value: s.experience, sub: 'timeline entries', icon: Briefcase, color: '#2EC4B6', to: '/admin/experience' },
  ];

  return (
    <>
      <PageHeader title={`Hey ${s.name?.split(' ')[0] || 'there'} 👋`} sub="Everything on your portfolio is editable from here." />
      <div className="grid gap-5 sm:grid-cols-3">
        {tiles.map(({ label, value, sub, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="rounded-2xl border-[2.5px] border-ink p-5 shadow-sticker transition hover:-translate-y-1" style={{ background: color }}>
            <Icon />
            <p className="mt-4 font-display text-5xl font-extrabold">{value}</p>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-ink/70">{sub}</p>
          </Link>
        ))}
      </div>
      <Card className="mt-8">
        <p className="font-display text-xl font-bold">Quick actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/projects?new=1" className="btn bg-crayon-yellow py-2.5"><Plus size={18} /> Add project</Link>
          <Link to="/admin/profile" className="btn bg-white py-2.5"><User size={18} /> Edit profile</Link>
        </div>
      </Card>
    </>
  );
}
