import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink, Eye, EyeOff, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, asset, errMsg, CRAYONS } from '../../lib/api';
import { PageHeader, Card, Field, Toggle, ImageField, TagsInput } from './ui';
import CoverArt from '../../components/CoverArt';

const BLANK = { title: '', tagline: '', description: '', image: '', tags: [], liveUrl: '', githubUrl: '', color: '#FF5A5F', featured: false, published: true, date: new Date().toISOString().slice(0, 10) };

function ProjectForm({ initial, onClose, onSaved }) {
  const [p, setP] = useState(() => ({ ...BLANK, ...initial, date: (initial?.date || BLANK.date).slice(0, 10) }));
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (p.liveUrl && !/^https?:\/\//i.test(p.liveUrl)) return toast.error('Live link must start with http:// or https://');
    setBusy(true);
    try {
      if (p._id) await api.put(`/projects/${p._id}`, p);
      else await api.post('/projects', p);
      toast.success('Saved');
      onSaved();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="flex h-full w-full max-w-xl flex-col border-l-[2.5px] border-ink bg-paper"
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-white px-6 py-4">
          <h2 className="font-display text-2xl font-extrabold">{p._id ? 'Edit project' : 'New project'}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-2xl border-2 border-ink">
            <div className="aspect-[16/9]">{p.image ? <img src={asset(p.image)} alt="" className="h-full w-full object-cover" /> : <CoverArt title={p.title || 'Project'} color={p.color} />}</div>
          </div>
          <Field label="Title *"><input required className="field" value={p.title} onChange={(e) => set('title', e.target.value)} /></Field>
          <Field label="Tagline" hint="One line shown on the card"><input className="field" value={p.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
          <Field label="Live project link" hint="Visitors open this when they click the card"><input className="field" placeholder="https://myproject.com" value={p.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} /></Field>
          <Field label="GitHub / source link"><input className="field" placeholder="https://github.com/…" value={p.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} /></Field>
          <ImageField label="Cover image (leave empty for auto-generated art)" value={p.image} onChange={(v) => set('image', v)} />
          <TagsInput label="Tags" value={p.tags} onChange={(v) => set('tags', v)} />
          <Field label="Description (optional)"><textarea rows={3} className="field resize-none" value={p.description} onChange={(e) => set('description', e.target.value)} /></Field>
          <Field label="Accent colour">
            <div className="flex flex-wrap items-center gap-2">
              {CRAYONS.map((c) => (
                <button type="button" key={c} onClick={() => set('color', c)} className={`h-9 w-9 rounded-full border-2 border-ink transition ${p.color === c ? 'scale-110 shadow-sticker' : ''}`} style={{ background: c }} aria-label={c} />
              ))}
              <input type="color" value={p.color} onChange={(e) => set('color', e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border-2 border-ink" />
            </div>
          </Field>
          <Field label="Date"><input type="date" className="field" value={p.date} onChange={(e) => set('date', e.target.value)} /></Field>
          <div className="flex flex-wrap gap-6">
            <Toggle label="Featured (wide card)" checked={p.featured} onChange={(v) => set('featured', v)} />
            <Toggle label="Published" checked={p.published} onChange={(v) => set('published', v)} />
          </div>
        </div>
        <div className="flex gap-3 border-t-2 border-ink bg-white px-6 py-4">
          <button type="button" onClick={onClose} className="btn flex-1 bg-white py-2.5">Cancel</button>
          <button disabled={busy} className="btn flex-1 bg-crayon-yellow py-2.5 disabled:opacity-60">{busy ? 'Saving…' : 'Save project'}</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function ProjectsManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [params, setParams] = useSearchParams();

  const load = () => api.get('/projects/all').then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);
  useEffect(() => { if (params.get('new')) { setEditing({}); setParams({}); } }, [params, setParams]);

  const move = async (i, dir) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    await api.put('/projects/reorder', { ids: next.map((x) => x._id) }).catch((e) => toast.error(errMsg(e)));
  };

  const patch = async (p, data) => {
    await api.put(`/projects/${p._id}`, data).then(load).catch((e) => toast.error(errMsg(e)));
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await api.delete(`/projects/${p._id}`).then(() => { toast.success('Deleted'); load(); }).catch((e) => toast.error(errMsg(e)));
  };

  return (
    <>
      <PageHeader
        title="Projects"
        sub="Add, edit and reorder the cards on your site. Order here = order on the site."
        action={<button onClick={() => setEditing({})} className="btn bg-crayon-yellow py-2.5"><Plus size={18} /> New project</button>}
      />
      <div className="space-y-3">
        {items.map((p, i) => (
          <Card key={p._id} className="flex flex-col gap-4 !p-4 sm:flex-row sm:items-center">
            <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl border-2 border-ink sm:w-32">
              {p.image ? <img src={asset(p.image)} alt="" className="h-full w-full object-cover" /> : <CoverArt title={p.title} color={p.color} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-xl font-bold">{p.title}</p>
                {p.featured && <span className="rounded-full bg-crayon-pink px-2 text-xs font-bold">featured</span>}
                {!p.published && <span className="rounded-full bg-ink/10 px-2 text-xs font-bold">hidden</span>}
              </div>
              <p className="truncate text-sm text-ink/60">{p.tagline}</p>
              {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-crayon-blue underline">{p.liveUrl} <ExternalLink size={11} /></a>}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1">
              <IconBtn label="Move up" onClick={() => move(i, -1)}><ArrowUp size={16} /></IconBtn>
              <IconBtn label="Move down" onClick={() => move(i, 1)}><ArrowDown size={16} /></IconBtn>
              <IconBtn label="Toggle featured" onClick={() => patch(p, { featured: !p.featured })} active={p.featured}><Star size={16} /></IconBtn>
              <IconBtn label="Toggle visibility" onClick={() => patch(p, { published: !p.published })}>{p.published ? <Eye size={16} /> : <EyeOff size={16} />}</IconBtn>
              <IconBtn label="Edit" onClick={() => setEditing(p)}><Pencil size={16} /></IconBtn>
              <IconBtn label="Delete" onClick={() => remove(p)} danger><Trash2 size={16} /></IconBtn>
            </div>
          </Card>
        ))}
        {!items.length && <Card className="text-center font-hand text-2xl">No projects yet. Hit “New project” ✏️</Card>}
      </div>
      <AnimatePresence>{editing && <ProjectForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}</AnimatePresence>
    </>
  );
}

function IconBtn({ children, onClick, label, danger, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border-2 transition ${danger ? 'border-ink/15 text-crayon-red hover:border-crayon-red' : active ? 'border-ink bg-crayon-pink' : 'border-ink/15 hover:border-ink'}`}
    >
      {children}
    </button>
  );
}
