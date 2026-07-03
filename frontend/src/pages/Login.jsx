import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Welcome back</h2>

      {error && <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 12 }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 14 }}>
        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
        <Link to="/register" style={{ color: 'var(--color-primary)' }}>Create account</Link>
      </div>
    </div>
  );
}