import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesService } from '../services/weatherApi';
import FavoritesList from '../components/FavoritesList';
import { LineSkeleton } from '../components/LoadingSkeleton';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await favoritesService.list();
      setFavorites(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemove = async (id) => {
    await favoritesService.remove(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSelect = (fav) => {
    navigate('/dashboard', { state: { city: fav.city_name } });
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Favorite Cities</h2>
      {loading ? <LineSkeleton width="100%" height={80} /> : (
        <FavoritesList favorites={favorites} onSelect={handleSelect} onRemove={handleRemove} />
      )}
    </div>
  );
}