import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function WeatherMap({ lat, lon, label, nearby = [] }) {
  if (!lat || !lon) {
    return <p className="text-muted">Search for a location first to see it on the map.</p>;
  }

  return (
    <div className="glass-card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
      <MapContainer center={[lat, lon]} zoom={9} style={{ height: 420, width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>{label || 'Selected location'}</Popup>
        </Marker>
        {nearby.map((city) => (
          <Marker key={city.id || `${city.lat}-${city.lon}`} position={[city.lat, city.lon]}>
            <Popup>{city.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}