import React, { useEffect, useState } from 'react';
import { weatherService } from '../services/weatherApi';
import { LineSkeleton } from '../components/LoadingSkeleton';
import { capitalize } from '../utils/formatters';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    weatherService.getHistory()
      .then((res) => setHistory(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Search History</h2>

      {loading ? (
        <LineSkeleton width="100%" height={200} />
      ) : history.length === 0 ? (
        <p className="text-muted">No searches yet — look up a city to see it appear here.</p>
      ) : (
        <div className="glass-card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: 14 }}>Date</th>
                <th style={{ padding: 14 }}>City</th>
                <th style={{ padding: 14 }}>Temperature</th>
                <th style={{ padding: 14 }}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 14 }}>{new Date(row.searched_at).toLocaleString()}</td>
                  <td style={{ padding: 14 }}>{row.city_name}, {row.country}</td>
                  <td style={{ padding: 14 }}>{row.temperature ? `${Math.round(row.temperature)}°` : '--'}</td>
                  <td style={{ padding: 14 }}>{capitalize(row.condition)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}