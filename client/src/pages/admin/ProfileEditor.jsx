import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { api, errMsg } from '../../lib/api';
import { PageHeader, Card, Field, Toggle, ImageField, ListEditor, TagsInput } from './ui';

export default function ProfileEditor() {
  const [p, setP] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.get('/profile').then(({ data }) => setP(data)).catch((e) => toast.error(errMsg(e))); }, []);
  if (!p) return <p className="font-hand text-2xl">loading…</p>;
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  const save = async (e) => {
    e?.preventDefault();
    setBusy(true);
    try { const { data } = await api.put('/profile', p); setP(data); toast.success('Profile saved — refresh your site to see it'); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  const text = (k, label, props = {}) => (
    <Field label={label}><input className="field" value={p[k] || ''} onChange={(e) => set(k, e.target.value)} {...props} /></Field>
  );

  return (
    <form onSubmit={save}>
      <PageHeader
        title="Profile & content"
        sub="Your name, intro, skills, links — everything outside of projects."
        action={<button disabled={busy} className="btn bg-crayon-yellow py-2.5 disabled:opacity-60"><Save size={18} /> {busy ? 'Saving…' : 'Save all'}</button>}
      />
      <div className="space-y-6">
        <Card>
          <h3 className="mb-5 font-display text-xl font-bold">Hero</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {text('name', 'Full name')}
            {text('role', 'Role / title')}
            {text('location', 'Location')}
            {text('availability', 'Availability note (yellow sticky)')}
          </div>
          <div className="mt-5 space-y-5">
            {text('headline', 'Headline')}
            <ImageField label="Avatar photo" value={p.avatar} onChange={(v) => set('avatar', v)} />
            <Toggle label="Show “open to work” stamp" checked={!!p.openToWork} onChange={(v) => set('openToWork', v)} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-5 font-display text-xl font-bold">About</h3>
          <Field label="Bio"><textarea rows={5} className="field resize-none" value={p.bio || ''} onChange={(e) => set('bio', e.target.value)} /></Field>
          <div className="mt-5 space-y-5">
            <ListEditor label="Stats (sticky notes, max 3)" items={p.stats} onChange={(v) => set('stats', v)} blank={{ value: '', label: '' }} fields={[{ key: 'value', placeholder: '24+', className: 'w-28' }, { key: 'label', placeholder: 'Projects shipped' }]} />
            <TagsInput label="Fun facts" value={p.funFacts} onChange={(v) => set('funFacts', v)} />
            <TagsInput label="Marquee words" value={p.marqueeWords} onChange={(v) => set('marqueeWords', v)} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-5 font-display text-xl font-bold">Skills & tools</h3>
          <ListEditor label="Skills (shown as crayons)" items={p.skills} onChange={(v) => set('skills', v)} blank={{ emoji: '✨', name: '', level: 80 }} fields={[{ key: 'emoji', placeholder: '⚛️', className: 'w-16 text-center' }, { key: 'name', placeholder: 'React' }, { key: 'level', placeholder: '80', type: 'number', className: 'w-24' }]} />
          <div className="mt-5"><TagsInput label="Tools" value={p.tools} onChange={(v) => set('tools', v)} /></div>
        </Card>

        <Card>
          <h3 className="mb-5 font-display text-xl font-bold">Contact & links</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {text('email', 'Public email', { type: 'email' })}
            {text('phone', 'Phone (optional)')}
          </div>
          <div className="mt-5 space-y-5">
            <ImageField label="Resume (PDF upload or link)" accept="application/pdf,image/*" value={p.resumeUrl} onChange={(v) => set('resumeUrl', v)} />
            <ListEditor label="Social links" items={p.socials} onChange={(v) => set('socials', v)} blank={{ label: '', url: '' }} fields={[{ key: 'label', placeholder: 'GitHub', className: 'w-36' }, { key: 'url', placeholder: 'https://…' }]} />
          </div>
        </Card>
      </div>
    </form>
  );
}
