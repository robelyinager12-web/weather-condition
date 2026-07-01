const axios = require('axios');

const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const GEO_URL = process.env.OPENWEATHER_GEO_URL || 'https://api.openweathermap.org/geo/1.0';
const API_KEY = process.env.OPENWEATHER_API_KEY;

const client = axios.create({ timeout: 10000 });

async function geocodeCity(query) {
  const { data } = await client.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });
  return data;
}

async function geocodeZip(zip, countryCode = '') {
  const q = countryCode ? `${zip},${countryCode}` : zip;
  const { data } = await client.get(`${GEO_URL}/zip`, {
    params: { zip: q, appid: API_KEY },
  });
  return data;
}

async function getCurrentWeather(lat, lon, units = 'metric') {
  const { data } = await client.get(`${BASE_URL}/weather`, {
    params: { lat, lon, units, appid: API_KEY },
  });
  return data;
}

async function getForecast(lat, lon, units = 'metric') {
  // 5 day / 3 hour forecast — used to derive hourly (24h) and daily (7d) views
  const { data } = await client.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, units, appid: API_KEY },
  });
  return data;
}

async function getOneCall(lat, lon, units = 'metric') {
  // Requires One Call API 3.0 subscription; provides hourly/daily/alerts/UV in one call.
  const { data } = await client.get('https://api.openweathermap.org/data/3.0/onecall', {
    params: { lat, lon, units, exclude: 'minutely', appid: API_KEY },
  });
  return data;
}

async function getAirQuality(lat, lon) {
  const { data } = await client.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  });
  return data;
}

module.exports = {
  geocodeCity,
  geocodeZip,
  getCurrentWeather,
  getForecast,
  getOneCall,
  getAirQuality,
};