import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, errMsg } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Field } from './ui';

export default function Account() {
  const { user } = useAuth();
  const [f, setF] = useState({ email: user?.email || '', currentPassword: '', newPassword: '' });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put('/auth/password', f);
      toast.success('Account updated');
      setF((x) => ({ ...x, currentPassword: '', newPassword: '' }));
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Account" sub="Change your admin login email or password." />
      <Card className="max-w-lg">
        <form onSubmit={save} className="space-y-4">
          <Field label="Login email"><input type="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field label="New password" hint="Leave blank to keep the current one (min 8 characters)"><input type="password" className="field" value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} /></Field>
          <Field label="Current password *"><input required type="password" className="field" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} /></Field>
          <button disabled={busy} className="btn bg-crayon-yellow py-2.5 disabled:opacity-60">{busy ? 'Saving…' : 'Update account'}</button>
        </form>
      </Card>
    </>
  );
}
