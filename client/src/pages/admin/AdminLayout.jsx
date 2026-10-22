import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, FolderKanban, Briefcase, Mail, KeyRound, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/profile', label: 'Profile & content', icon: User },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/messages', label: 'Messages', icon: Mail, badge: true },
  { to: '/admin/account', label: 'Account', icon: KeyRound },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    api.get('/messages/unread-count').then(({ data }) => setUnread(data.count)).catch(() => {});
  }, [loc.pathname]);

  const Side = (
    <aside className="flex h-full flex-col gap-1 border-r-[2.5px] border-ink bg-white p-4">
      <Link to="/admin" className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-crayon-yellow">🖍️</span>
        <span className="font-display text-xl font-extrabold">Studio</span>
      </Link>
      {NAV.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition ${isActive ? 'border-2 border-ink bg-crayon-yellow shadow-sticker' : 'border-2 border-transparent hover:bg-cream'}`
          }
        >
          <Icon size={18} /> {label}
          {badge && unread > 0 && <span className="ml-auto rounded-full bg-crayon-red px-2 text-xs font-bold text-white">{unread}</span>}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 pt-6">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] hover:bg-cream">
          <ExternalLink size={18} /> View site
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-crayon-red hover:bg-crayon-red/10">
          <LogOut size={18} /> Log out
        </button>
        <p className="truncate px-3 pt-2 text-xs text-ink/50">{user?.email}</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-paper">
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">{Side}</div>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink bg-white px-4 py-3 lg:hidden">
        <span className="font-display font-extrabold">🖍️ Studio</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72">
            <button className="absolute right-3 top-3 z-10" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
            {Side}
          </div>
        </div>
      )}
      <main className="canvas-dots min-h-screen px-4 py-8 sm:px-8 lg:ml-64 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
