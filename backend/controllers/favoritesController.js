const Favorite = require('../models/Favorite');

async function listFavorites(req, res, next) {
  try {
    const rows = await Favorite.findByUser(req.user.id);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function addFavorite(req, res, next) {
  try {
    const { cityName, country, latitude, longitude } = req.body;
    const favorite = await Favorite.create({ userId: req.user.id, cityName, country, latitude, longitude });
    res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'This city is already in your favorites.' });
    }
    next(err);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const removed = await Favorite.remove(req.params.id, req.user.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Favorite not found.' });
    }
    res.json({ success: true, message: 'Removed from favorites.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listFavorites, addFavorite, removeFavorite };