import { useRef, useState } from 'react';
import { Upload, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, asset, errMsg } from '../../lib/api';

export function PageHeader({ title, sub, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl font-extrabold">{title}</h1>
        {sub && <p className="mt-1 text-ink/60">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border-[2.5px] border-ink bg-white p-5 shadow-sticker sm:p-6 ${className}`}>{children}</div>;
}

export function Field({ label, children, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <span className={`relative h-7 w-12 rounded-full border-2 border-ink transition ${checked ? 'bg-crayon-green' : 'bg-ink/10'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full border-2 border-ink bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

// Upload a file OR paste a URL
export function ImageField({ value, onChange, label = 'Image', accept = 'image/*' }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadFile(f)); toast.success('Uploaded'); } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); e.target.value = ''; }
  };
  const isImg = value && !/\.pdf$/i.test(value);
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {isImg ? (
          <img src={asset(value)} alt="" className="h-16 w-16 shrink-0 rounded-xl border-2 border-ink object-cover" />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border-2 border-dashed border-ink/30 text-xs text-ink/40">{value ? 'file' : 'none'}</div>
        )}
        <div className="flex-1 space-y-2">
          <input className="field" placeholder="https://… or upload" value={value || ''} onChange={(e) => onChange(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" onClick={() => ref.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-crayon-yellow px-3 py-1 text-sm font-semibold">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
            </button>
            {value && <button type="button" onClick={() => onChange('')} className="text-sm text-crayon-red underline">remove</button>}
          </div>
        </div>
        <input ref={ref} type="file" accept={accept} hidden onChange={pick} />
      </div>
    </Field>
  );
}

// Editable list of objects, e.g. socials [{label,url}]
export function ListEditor({ label, items = [], onChange, fields, blank }) {
  const update = (i, k, v) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            {fields.map((f) => (
              <input
                key={f.key}
                className={`field ${f.className || ''}`}
                placeholder={f.placeholder}
                type={f.type || 'text'}
                value={it[f.key] ?? ''}
                onChange={(e) => update(i, f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            ))}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 rounded-xl border-2 border-ink/15 px-3 text-crayon-red hover:border-crayon-red" aria-label="Remove">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { ...blank }])} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-ink/40 px-3 py-1.5 text-sm font-semibold hover:border-ink">
          <Plus size={14} /> Add
        </button>
      </div>
    </Field>
  );
}

// Comma separated string list
export function TagsInput({ label, value = [], onChange, hint }) {
  const [text, setText] = useState('');
  const add = () => {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setText('');
  };
  return (
    <Field label={label} hint={hint || 'Type and press Enter (or comma-separate)'}>
      <div className="field flex flex-wrap items-center gap-1.5 py-2">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 text-sm font-medium">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-ink/50 hover:text-crayon-red">×</button>
          </span>
        ))}
        <input
          className="min-w-[120px] flex-1 bg-transparent outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          onBlur={add}
          placeholder="add…"
        />
      </div>
    </Field>
  );
}
