const User = require('../models/User');
const SearchHistory = require('../models/SearchHistory');
const Favorite = require('../models/Favorite');
const WeatherAlert = require('../models/WeatherAlert');

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }
    const deleted = await User.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const [totalUsers, totalSearches, totalFavorites, totalAlerts, topCities] = await Promise.all([
      User.count(),
      SearchHistory.count(),
      Favorite.count(),
      WeatherAlert.count(),
      SearchHistory.topCities(10),
    ]);

    res.json({
      success: true,
      data: { totalUsers, totalSearches, totalFavorites, totalAlerts, topCities },
    });
  } catch (err) {
    next(err);
  }
}

async function createAlert(req, res, next) {
  try {
    const { cityName, alertType, severity, message, startsAt, endsAt } = req.body;
    const alert = await WeatherAlert.create({
      cityName,
      alertType,
      severity,
      message,
      startsAt,
      endsAt,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
}

async function listAlerts(req, res, next) {
  try {
    const alerts = await WeatherAlert.findAll();
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
}

async function deleteAlert(req, res, next) {
  try {
    await WeatherAlert.remove(req.params.id);
    res.json({ success: true, message: 'Alert removed.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, deleteUser, getStats, createAlert, listAlerts, deleteAlert };