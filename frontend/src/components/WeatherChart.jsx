import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDayName } from '../utils/formatters';

export default function WeatherChart({ daily = [], metric = 'temp', title = 'Temperature' }) {
  if (!daily.length) return null;

  const data = daily.map((day, i) => ({
    name: formatDayName(day.date, i),
    max: Math.round(day.maxTemp),
    min: Math.round(day.minTemp),
    pop: Math.round(day.pop * 100),
  }));

  const lines = metric === 'temp'
    ? [{ key: 'max', color: 'var(--color-danger)' }, { key: 'min', color: 'var(--color-secondary)' }]
    : [{ key: 'pop', color: 'var(--color-primary)' }];

  return (
    <div className="glass-card fade-in">
      <h3 style={{ marginBottom: 16 }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {lines.map((line) => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}