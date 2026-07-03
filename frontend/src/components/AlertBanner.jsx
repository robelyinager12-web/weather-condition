import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const severityColor = {
  minor: 'var(--color-secondary)',
  moderate: 'var(--color-warning)',
  severe: 'var(--color-danger)',
  extreme: 'var(--color-danger)',
};

export default function AlertBanner({ alert }) {
  if (!alert) return null;
  const color = severityColor[alert.severity] || 'var(--color-warning)';

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', borderLeft: `4px solid ${color}` }}>
      <FiAlertTriangle color={color} size={22} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <strong style={{ textTransform: 'capitalize' }}>{alert.alert_type?.replace('_', ' ')}</strong>
        <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>{alert.message}</p>
      </div>
    </div>
  );
}