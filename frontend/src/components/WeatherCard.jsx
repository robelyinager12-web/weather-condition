import React from 'react';
import { FiDroplet, FiWind, FiEye, FiSunrise, FiSunset, FiThermometer } from 'react-icons/fi';
import { formatTemp, formatTime, weatherIconUrl, capitalize, windDirection } from '../utils/formatters';

export default function WeatherCard({ data, unit = 'celsius' }) {
  if (!data) return null;
  const { location, current, airQuality } = data;
  const weather = current.weather?.[0];
  const aqi = airQuality?.list?.[0]?.main?.aqi;

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between' }}>
      <div>
        <p className="text-muted" style={{ fontSize: 14 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <h2 style={{ fontSize: 24, marginTop: 4 }}>{location.name}, {location.country}</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          {weather && (
            <img src={weatherIconUrl(weather.icon)} alt={weather.description} width={72} height={72} />
          )}
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {formatTemp(current.main?.temp, unit)}
            </div>
            <p className="text-muted">{capitalize(weather?.description)}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 16 }}>
        <Stat icon={<FiThermometer />} label="Feels like" value={formatTemp(current.main?.feels_like, unit)} />
        <Stat icon={<FiDroplet />} label="Humidity" value={`${current.main?.humidity ?? '--'}%`} />
        <Stat icon={<FiWind />} label="Wind" value={`${current.wind?.speed ?? '--'} m/s ${current.wind?.deg ? windDirection(current.wind.deg) : ''}`} />
        <Stat icon={<FiEye />} label="Visibility" value={current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : '--'} />
        <Stat icon={<FiSunrise />} label="Sunrise" value={formatTime(current.sys?.sunrise, current.timezone)} />
        <Stat icon={<FiSunset />} label="Sunset" value={formatTime(current.sys?.sunset, current.timezone)} />
        {aqi && <Stat icon={<FiDroplet />} label="Air Quality" value={['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi]} />}
        <Stat icon={<FiDroplet />} label="Pressure" value={`${current.main?.pressure ?? '--'} hPa`} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
      <div>
        <div className="text-muted" style={{ fontSize: 12 }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
      </div>
    </div>
  );
}