export function formatTemp(temp, unit = 'celsius') {
  if (temp === null || temp === undefined) return '--';
  return `${Math.round(temp)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatTime(unixSeconds, timezoneOffsetSeconds = 0) {
  if (!unixSeconds) return '--';
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDayName(dateStr, index) {
  if (index === 0) return 'Today';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function weatherIconUrl(iconCode, size = '2x') {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}