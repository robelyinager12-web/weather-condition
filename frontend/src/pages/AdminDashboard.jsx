import React, { useEffect, useState } from 'react';
import { FiUsers, FiSearch, FiStar, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { adminService } from '../services/weatherApi';
import { LineSkeleton } from '../components/LoadingSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [statsRes, usersRes] = await Promise.all([adminService.getStats(), adminService.listUsers()]);
    setStats(statsRes.data.data);
    setUsers(usersRes.data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDeleteUser = async (id) => {
    await adminService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading) return <LineSkeleton width="100%" height={300} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon={<FiUsers />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<FiSearch />} label="Total Searches" value={stats.totalSearches} />
        <StatCard icon={<FiStar />} label="Favorites Saved" value={stats.totalFavorites} />
        <StatCard icon={<FiAlertTriangle />} label="Active Alerts" value={stats.totalAlerts} />
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: 12 }}>Top Searched Cities</h3>
        {stats.topCities.map((c) => (
          <div key={c.city_name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
            <span>{c.city_name}</span>
            <span className="text-muted">{c.searches} searches</span>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <h3 style={{ padding: '16px 16px 0' }}>Manage Users</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 14 }}>Name</th>
              <th style={{ padding: 14 }}>Email</th>
              <th style={{ padding: 14 }}>Role</th>
              <th style={{ padding: 14 }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 14 }}>{u.full_name}</td>
                <td style={{ padding: 14 }}>{u.email}</td>
                <td style={{ padding: 14, textTransform: 'capitalize' }}>{u.role}</td>
                <td style={{ padding: 14 }}>
                  <button className="btn btn-outline" style={{ padding: 8 }} onClick={() => handleDeleteUser(u.id)}>
                    <FiTrash2 size={14} color="var(--color-danger)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ color: 'var(--color-primary)', fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        <div className="text-muted" style={{ fontSize: 13 }}>{label}</div>
      </div>
    </div>
  );
}