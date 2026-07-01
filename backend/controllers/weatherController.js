const SearchHistory = require('../models/SearchHistory');
const weatherService = require('../services/weatherService');

async function resolveLocation({ city, zip, lat, lon, country }) {
  if (lat && lon) {
    return { lat: Number(lat), lon: Number(lon), name: city || 'Selected location', country: country || '' };
  }
  if (zip) {
    const geo = await weatherService.geocodeZip(zip, country);
    return { lat: geo.lat, lon: geo.lon, name: geo.name, country: geo.country };
  }
  if (city) {
    const query = country ? `${city},${country}` : city;
    const results = await weatherService.geocodeCity(query);
    if (!results || results.length === 0) {
      const err = new Error('City not found.');
      err.status = 404;
      throw err;
    }
    const [first] = results;
    return { lat: first.lat, lon: first.lon, name: first.name, country: first.country };
  }
  const err = new Error('Provide a city, zip code, or coordinates.');
  err.status = 400;
  throw err;
}

async function getCurrent(req, res, next) {
  try {
    const { city, zip, lat, lon, country, units } = req.query;
    const unitParam = units === 'imperial' ? 'imperial' : 'metric';

    const location = await resolveLocation({ city, zip, lat, lon, country });
    const [current, air] = await Promise.all([
      weatherService.getCurrentWeather(location.lat, location.lon, unitParam),
      weatherService.getAirQuality(location.lat, location.lon).catch(() => null),
    ]);

    if (req.user) {
      await SearchHistory.create({
        userId: req.user.id,
        cityName: location.name,
        country: location.country,
        temperature: current.main?.temp ?? null,
        condition: current.weather?.[0]?.main ?? null,
      });
    }

    res.json({
      success: true,
      data: { location, current, airQuality: air },
    });
  } catch (err) {
    next(err);
  }
}

async function getForecast(req, res, next) {
  try {
    const { city, zip, lat, lon, country, units } = req.query;
    const unitParam = units === 'imperial' ? 'imperial' : 'metric';

    const location = await resolveLocation({ city, zip, lat, lon, country });
    const forecast = await weatherService.getForecast(location.lat, location.lon, unitParam);

    const hourly = forecast.list.slice(0, 8);

    const dailyMap = new Map();
    forecast.list.forEach((slice) => {
      const day = slice.dt_txt.split(' ')[0];
      if (!dailyMap.has(day)) dailyMap.set(day, []);
      dailyMap.get(day).push(slice);
    });
    const daily = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([date, slices]) => {
        const temps = slices.map((s) => s.main.temp);
        return {
          date,
          minTemp: Math.min(...temps),
          maxTemp: Math.max(...temps),
          condition: slices[Math.floor(slices.length / 2)].weather[0],
          pop: Math.max(...slices.map((s) => s.pop ?? 0)),
        };
      });

    res.json({ success: true, data: { location, hourly, daily } });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const rows = await SearchHistory.findByUser(req.user.id, 50);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrent, getForecast, getHistory };