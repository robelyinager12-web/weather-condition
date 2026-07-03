import React, { useState, useCallback } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 600);

  const parseAndSearch = useCallback((raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const coordMatch = trimmed.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      onSearch({ lat: coordMatch[1], lon: coordMatch[3] });
      return;
    }

    const isZip = /^\d{4,10}$/.test(trimmed);
    if (isZip) {
      onSearch({ zip: trimmed });
      return;
    }

    onSearch({ city: trimmed });
  }, [onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    parseAndSearch(value);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      onSearch({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', gap: 8, padding: 10 }}>
      <FiSearch size={20} color="var(--color-text-muted)" style={{ marginLeft: 8, alignSelf: 'center' }} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search city, zip code, or lat,lon"
        style={{ flex: 1, border: 'none', background: 'transparent' }}
      />
      <button type="button" className="btn btn-outline" onClick={handleUseLocation} title="Use my location">
        <FiMapPin />
      </button>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}