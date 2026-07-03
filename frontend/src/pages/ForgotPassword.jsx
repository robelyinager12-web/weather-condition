import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Reset your password</h2>

      {status === 'sent' ? (
        <p style={{ textAlign: 'center' }}>
          If an account exists for <strong>{email}</strong>, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Enter your email and we'll send you a link to reset your password.
          </p>
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Reset Link'}
          </button>
          {status === 'error' && <p style={{ color: 'var(--color-danger)', fontSize: 14 }}>Something went wrong. Please try again.</p>}
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        <Link to="/login" style={{ color: 'var(--color-primary)' }}>Back to login</Link>
      </p>
    </div>
  );
}