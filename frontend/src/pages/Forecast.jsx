import React, { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import DailyForecast from '../components/DailyForecast';
import WeatherChart from '../components/WeatherChart';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Forecast() {
  const { forecast, loading, error, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather({ city: 'London' }).catch(() => {});
  }, [fetchWeather]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SearchBar onSearch={(q) => fetchWeather(q).catch(() => {})} loading={loading} />

      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      {loading && !forecast ? (
        <>
          <CardSkeleton height={260} />
          <CardSkeleton height={260} />
        </>
      ) : (
        forecast && (
          <>
            <WeatherChart daily={forecast.daily} metric="temp" title="Temperature Trend" />
            <WeatherChart daily={forecast.daily} metric="pop" title="Rain Probability" />
            <DailyForecast daily={forecast.daily} />
          </>
        )
      )}
    </div>
  );
}