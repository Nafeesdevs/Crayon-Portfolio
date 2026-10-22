import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import { api, errMsg } from '../../lib/api';
import { PageHeader, Card, Field, Toggle } from './ui';

const BLANK = { role: '', company: '', start: '', end: '', current: false, description: '' };

export default function ExperienceManager() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/experience/all').then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const update = (i, k, v) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const save = async (it) => {
    if (!it.role || !it.company) return toast.error('Role and company are required');
    try {
      if (it._id) await api.put(`/experience/${it._id}`, it);
      else await api.post('/experience', it);
      toast.success('Saved');
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const remove = async (it, i) => {
    if (!it._id) return setItems((xs) => xs.filter((_, j) => j !== i));
    if (!confirm('Delete this entry?')) return;
    await api.delete(`/experience/${it._id}`).then(load).catch((e) => toast.error(errMsg(e)));
  };

  return (
    <>
      <PageHeader title="Experience" sub="Shown as an animated timeline. Hidden on the site if empty." action={<button onClick={() => setItems((x) => [...x, { ...BLANK }])} className="btn bg-crayon-yellow py-2.5"><Plus size={18} /> Add entry</button>} />
      <div className="space-y-4">
        {items.map((it, i) => (
          <Card key={it._id || `new-${i}`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role *"><input className="field" value={it.role} onChange={(e) => update(i, 'role', e.target.value)} /></Field>
              <Field label="Company *"><input className="field" value={it.company} onChange={(e) => update(i, 'company', e.target.value)} /></Field>
              <Field label="Start"><input className="field" placeholder="Jan 2025" value={it.start} onChange={(e) => update(i, 'start', e.target.value)} /></Field>
              <Field label="End"><input className="field" placeholder="Dec 2025" disabled={it.current} value={it.end} onChange={(e) => update(i, 'end', e.target.value)} /></Field>
            </div>
            <div className="mt-4"><Field label="Description"><textarea rows={2} className="field resize-none" value={it.description} onChange={(e) => update(i, 'description', e.target.value)} /></Field></div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Toggle label="I currently work here" checked={!!it.current} onChange={(v) => update(i, 'current', v)} />
              <div className="flex gap-2">
                <button onClick={() => remove(it, i)} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink/15 px-3 py-1.5 text-sm text-crayon-red hover:border-crayon-red"><Trash2 size={14} /> Delete</button>
                <button onClick={() => save(it)} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-crayon-yellow px-3 py-1.5 text-sm font-semibold"><Save size={14} /> Save</button>
              </div>
            </div>
          </Card>
        ))}
        {!items.length && <Card className="text-center font-hand text-2xl">No entries yet ✏️</Card>}
      </div>
    </>
  );
}
