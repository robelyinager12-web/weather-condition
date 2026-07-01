const pool = require('../config/db');

async function listFavorites(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function addFavorite(req, res, next) {
  try {
    const { cityName, country, latitude, longitude } = req.body;
    const result = await pool.query(
      `INSERT INTO favorites (user_id, city_name, country, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, cityName, country, latitude, longitude]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'This city is already in your favorites.' });
    }
    next(err);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const result = await pool.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Favorite not found.' });
    }
    res.json({ success: true, message: 'Removed from favorites.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listFavorites, addFavorite, removeFavorite };