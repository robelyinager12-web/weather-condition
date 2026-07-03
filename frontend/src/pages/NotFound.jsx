import React from 'react';
import { Link } from 'react-router-dom';
import { FiCloudOff } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <FiCloudOff size={48} color="var(--color-text-muted)" />
      <h1 style={{ fontSize: 28 }}>404 — Page Not Found</h1>
      <p className="text-muted">The forecast for this page is... nonexistent.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Back to Home</Link>
    </div>
  );
}