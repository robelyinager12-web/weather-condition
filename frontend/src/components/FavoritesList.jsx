import React from 'react';
import { FiStar, FiTrash2 } from 'react-icons/fi';

export default function FavoritesList({ favorites = [], onSelect, onRemove }) {
  if (!favorites.length) {
    return <p className="text-muted">No favorite cities yet — search for a city and star it to save it here.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {favorites.map((fav) => (
        <div key={fav.id} className="glass-card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => onSelect?.(fav)}
            style={{ background: 'none', textAlign: 'left', flex: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiStar color="var(--color-warning)" fill="var(--color-warning)" size={16} />
              <strong>{fav.city_name}</strong>
            </div>
            <div className="text-muted" style={{ fontSize: 13 }}>{fav.country}</div>
          </button>
          <button className="btn btn-outline" style={{ padding: 8 }} onClick={() => onRemove?.(fav.id)} aria-label="Remove favorite">
            <FiTrash2 size={16} color="var(--color-danger)" />
          </button>
        </div>
      ))}
    </div>
  );
}