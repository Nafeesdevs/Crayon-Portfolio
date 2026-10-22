import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, MailOpen, Mail, Reply } from 'lucide-react';
import { api, errMsg } from '../../lib/api';
import { PageHeader, Card } from './ui';

export default function Messages() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const load = () => api.get('/messages').then(({ data }) => setItems(data)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const toggleRead = (m, read) => api.patch(`/messages/${m._id}`, { read }).then(load);
  const open = (m) => { setOpenId(openId === m._id ? null : m._id); if (!m.read) toggleRead(m, true); };
  const remove = (m) => confirm('Delete this message?') && api.delete(`/messages/${m._id}`).then(load);

  return (
    <>
      <PageHeader title="Messages" sub="Everything sent through your contact form." />
      <div className="space-y-3">
        {items.map((m) => (
          <Card key={m._id} className={`!p-0 ${m.read ? '' : 'bg-crayon-yellow/30'}`}>
            <button onClick={() => open(m)} className="flex w-full items-center gap-4 p-4 text-left">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.read ? 'bg-ink/15' : 'bg-crayon-red'}`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{m.name} <span className="font-normal text-ink/50">· {m.email}</span></p>
                <p className="truncate text-sm text-ink/70">{m.subject || m.body}</p>
              </div>
              <span className="shrink-0 text-xs text-ink/50">{new Date(m.createdAt).toLocaleString()}</span>
            </button>
            {openId === m._id && (
              <div className="border-t-2 border-ink/10 p-4">
                {m.subject && <p className="mb-2 font-display text-lg font-bold">{m.subject}</p>}
                <p className="whitespace-pre-wrap text-ink/80">{m.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'your message')}`} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-crayon-green px-3 py-1.5 text-sm font-semibold"><Reply size={14} /> Reply</a>
                  <button onClick={() => toggleRead(m, !m.read)} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink/15 px-3 py-1.5 text-sm hover:border-ink">{m.read ? <Mail size={14} /> : <MailOpen size={14} />} Mark {m.read ? 'unread' : 'read'}</button>
                  <button onClick={() => remove(m)} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink/15 px-3 py-1.5 text-sm text-crayon-red hover:border-crayon-red"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            )}
          </Card>
        ))}
        {!items.length && <Card className="text-center font-hand text-2xl">Inbox zero 🎉</Card>}
      </div>
    </>
  );
}
