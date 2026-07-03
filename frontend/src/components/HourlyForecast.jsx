import React from 'react';
import { weatherIconUrl } from '../utils/formatters';

export default function HourlyForecast({ hourly = [], unit = 'celsius' }) {
  if (!hourly.length) return null;

  return (
    <div className="glass-card fade-in">
      <h3 style={{ marginBottom: 16 }}>24-Hour Forecast</h3>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {hourly.map((slice) => {
          const time = new Date(slice.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' });
          const weather = slice.weather?.[0];
          return (
            <div key={slice.dt} style={{ minWidth: 72, textAlign: 'center' }}>
              <div className="text-muted" style={{ fontSize: 12 }}>{time}</div>
              {weather && <img src={weatherIconUrl(weather.icon)} alt={weather.description} width={40} height={40} />}
              <div style={{ fontWeight: 600 }}>
                {Math.round(slice.main.temp)}°{unit === 'fahrenheit' ? 'F' : 'C'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}