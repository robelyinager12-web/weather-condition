import React, { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import WeatherMap from '../components/WeatherMap';

export default function MapView() {
  const { current, loading, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather({ city: 'London' }).catch(() => {});
  }, [fetchWeather]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SearchBar onSearch={(q) => fetchWeather(q).catch(() => {})} loading={loading} />
      {current && (
        <WeatherMap
          lat={current.location.lat}
          lon={current.location.lon}
          label={`${current.location.name}, ${current.location.country}`}
        />
      )}
    </div>
  );
}