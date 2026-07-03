import { useState, useCallback } from 'react';
import { weatherService } from '../services/weatherApi';

export function useWeather() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (query, units = 'metric') => {
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        weatherService.getCurrent({ ...query, units }),
        weatherService.getForecast({ ...query, units }),
      ]);
      setCurrent(currentRes.data.data);
      setForecast(forecastRes.data.data);
      return { current: currentRes.data.data, forecast: forecastRes.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Could not load weather for that location.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { current, forecast, loading, error, fetchWeather };
}