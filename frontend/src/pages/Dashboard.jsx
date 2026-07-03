import React, { useState, useEffect, useCallback } from 'react';
import { FiStar } from 'react-icons/fi';
import { useWeather } from '../hooks/useWeather';
import { favoritesService } from '../services/weatherApi';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Dashboard() {
  const { current, forecast, loading, error, fetchWeather } = useWeather();
  const [savingFavorite, setSavingFavorite] = useState(false);

  useEffect(() => {
    fetchWeather({ city: 'London' }).catch(() => {});
  }, [fetchWeather]);

  const handleSearch = useCallback((query) => {
    fetchWeather(query).catch(() => {});
  }, [fetchWeather]);

  const handleAddFavorite = async () => {
    if (!current) return;
    setSavingFavorite(true);
    try {
      await favoritesService.add({
        cityName: current.location.name,
        country: current.location.country,
        latitude: current.location.lat,
        longitude: current.location.lon,
      });
    } catch (err) {
      // already a favorite or network issue — non-blocking
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      {loading && !current ? (
        <CardSkeleton height={220} />
      ) : (
        current && (
          <div style={{ position: 'relative' }}>
            <WeatherCard data={current} />
            <button
              className="btn btn-outline"
              onClick={handleAddFavorite}
              disabled={savingFavorite}
              style={{ position: 'absolute', top: 24, right: 24 }}
              title="Save to favorites"
            >
              <FiStar />
            </button>
          </div>
        )
      )}

      {loading && !forecast ? (
        <CardSkeleton height={140} />
      ) : (
        forecast && <HourlyForecast hourly={forecast.hourly} />
      )}
    </div>
  );
}