import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiCloud } from 'react-icons/fi';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card fade-in" style={{ width: '100%', maxWidth: 420 }}>
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 20, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22 }}
        >
          <FiCloud color="var(--color-primary)" size={26} />
          SkyPulse
        </Link>
        <Outlet />
      </div>
    </div>
  );
}