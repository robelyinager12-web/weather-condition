import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiCloud } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className="glass-card"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '14px 24px' }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20 }}>
        <FiCloud color="var(--color-primary)" size={24} />
        SkyPulse
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-outline" onClick={toggleTheme} aria-label="Toggle theme" style={{ padding: 10 }}>
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        {isAuthenticated ? (
          <>
            <span className="text-muted" style={{ fontSize: 14 }}>Hi, {user?.full_name?.split(' ')[0]}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}