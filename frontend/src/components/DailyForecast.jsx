import React from 'react';
import { weatherIconUrl, formatDayName } from '../utils/formatters';

export default function DailyForecast({ daily = [], unit = 'celsius' }) {
  if (!daily.length) return null;

  return (
    <div className="glass-card fade-in">
      <h3 style={{ marginBottom: 16 }}>7-Day Forecast</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {daily.map((day, i) => (
          <div key={day.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < daily.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <span style={{ width: 90, fontWeight: 500 }}>{formatDayName(day.date, i)}</span>
            <img src={weatherIconUrl(day.condition.icon)} alt={day.condition.description} width={32} height={32} />
            <span className="text-muted" style={{ width: 90, textAlign: 'center', fontSize: 13 }}>
              {Math.round(day.pop * 100)}% rain
            </span>
            <span style={{ width: 90, textAlign: 'right' }}>
              <strong>{Math.round(day.maxTemp)}°</strong>{' '}
              <span className="text-muted">{Math.round(day.minTemp)}°</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}