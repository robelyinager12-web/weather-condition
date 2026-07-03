import React, { useEffect, useState } from 'react';
import { profileService } from '../services/weatherApi';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    tempUnit: 'celsius',
    windUnit: 'kmh',
    language: 'en',
    notificationsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    profileService.get().then((res) => {
      const s = res.data.data.settings;
      if (s) {
        setSettings({
          tempUnit: s.temp_unit,
          windUnit: s.wind_unit,
          language: s.language,
          notificationsEnabled: s.notifications_enabled,
        });
        if (s.theme) setTheme(s.theme);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    try {
      await profileService.updateSettings({
        theme,
        tempUnit: settings.tempUnit,
        windUnit: settings.windUnit,
        language: settings.language,
        notificationsEnabled: settings.notificationsEnabled,
      });
      setStatus('saved');
    } catch (err) {
      setStatus('error');
    }
  };

  if (loading) return <p className="text-muted">Loading settings…</p>;

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ marginBottom: 16 }}>Settings</h2>
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Theme">
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>

        <Field label="Temperature Unit">
          <select value={settings.tempUnit} onChange={(e) => setSettings({ ...settings, tempUnit: e.target.value })}>
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>
        </Field>

        <Field label="Wind Speed Unit">
          <select value={settings.windUnit} onChange={(e) => setSettings({ ...settings, windUnit: e.target.value })}>
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>
        </Field>

        <Field label="Language">
          <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
          />
          Enable weather alert notifications
        </label>

        <button className="btn btn-primary" onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Settings'}
        </button>
        {status === 'saved' && <p style={{ color: 'var(--color-success)', fontSize: 14 }}>Settings saved.</p>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ fontSize: 14 }}>
      {label}
      <div style={{ marginTop: 4 }}>{children}</div>
    </label>
  );
}