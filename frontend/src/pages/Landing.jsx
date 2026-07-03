import React from 'react';
import { Link } from 'react-router-dom';
import { FiCloud, FiMapPin, FiTrendingUp, FiBell } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const features = [
  { icon: FiMapPin, title: 'Search Anywhere', text: 'Look up weather by city, zip code, or coordinates in seconds.' },
  { icon: FiTrendingUp, title: '7-Day Forecasts', text: 'Hourly and daily forecasts with temperature, rain and wind charts.' },
  { icon: FiBell, title: 'Weather Alerts', text: 'Get notified about storms, heat waves, and severe conditions.' },
];

export default function Landing() {
  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <FiCloud size={56} color="var(--color-primary)" />
        <h1 style={{ fontSize: 40, marginTop: 16 }}>Weather, beautifully simple.</h1>
        <p className="text-muted" style={{ fontSize: 18, maxWidth: 560, margin: '16px auto 32px' }}>
          SkyPulse gives you real-time conditions, detailed forecasts, and severe weather alerts for any city on Earth.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px' }}>Get Started Free</Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '14px 28px' }}>Log In</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 72, textAlign: 'left' }}>
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-card">
              <Icon size={28} color="var(--color-primary)" />
              <h3 style={{ marginTop: 12, fontSize: 18 }}>{title}</h3>
              <p className="text-muted" style={{ marginTop: 8, fontSize: 14 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}