import React, { useEffect, useState } from 'react';
import { profileService } from '../services/weatherApi';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.get().then((res) => {
      const { user } = res.data.data;
      setForm({ fullName: user.full_name, email: user.email });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const res = await profileService.update({ fullName: form.fullName });
      setUser(res.data.data);
      setStatus('saved');
    } catch (err) {
      setStatus('error');
    }
  };

  if (loading) return <p className="text-muted">Loading profile…</p>;

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ marginBottom: 16 }}>Your Profile</h2>
      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 14 }}>
          Full Name
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ fontSize: 14 }}>
          Email
          <input value={form.email} disabled style={{ width: '100%', marginTop: 4, opacity: 0.6 }} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
        {status === 'saved' && <p style={{ color: 'var(--color-success)', fontSize: 14 }}>Profile updated.</p>}
        {status === 'error' && <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>Something went wrong.</p>}
      </form>
    </div>
  );
}