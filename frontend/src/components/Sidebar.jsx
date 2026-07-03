import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCalendar, FiStar, FiClock, FiMap, FiUser, FiSettings, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/forecast', label: 'Forecast', icon: FiCalendar },
  { to: '/favorites', label: 'Favorites', icon: FiStar },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/map', label: 'Map', icon: FiMap },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside
      className="glass-card"
      style={{ width: 220, minHeight: 'calc(100vh - 64px)', borderRadius: 0, borderLeft: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', gap: 4, padding: '20px 12px' }}
    >
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500,
            color: isActive ? '#fff' : 'var(--color-text)',
            background: isActive ? 'var(--color-primary)' : 'transparent',
          })}
        >
          <Icon size={18} /> {label}
        </NavLink>
      ))}

      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500, marginTop: 8,
            color: isActive ? '#fff' : 'var(--color-warning)',
            background: isActive ? 'var(--color-warning)' : 'transparent',
          })}
        >
          <FiShield size={18} /> Admin
        </NavLink>
      )}
    </aside>
  );
}