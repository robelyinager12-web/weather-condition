const pool = require('../config/db');

async function listUsers(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const [users, searches, favorites, alerts] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM search_history'),
      pool.query('SELECT COUNT(*)::int AS count FROM favorites'),
      pool.query('SELECT COUNT(*)::int AS count FROM weather_alerts'),
    ]);

    const topCities = await pool.query(
      `SELECT city_name, COUNT(*)::int AS searches
       FROM search_history GROUP BY city_name
       ORDER BY searches DESC LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        totalUsers: users.rows[0].count,
        totalSearches: searches.rows[0].count,
        totalFavorites: favorites.rows[0].count,
        totalAlerts: alerts.rows[0].count,
        topCities: topCities.rows,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createAlert(req, res, next) {
  try {
    const { cityName, alertType, severity, message, startsAt, endsAt } = req.body;
    const result = await pool.query(
      `INSERT INTO weather_alerts (city_name, alert_type, severity, message, starts_at, ends_at, created_by)
       VALUES ($1, $2, $3, $4, COALESCE($5, NOW()), $6, $7) RETURNING *`,
      [cityName, alertType, severity, message, startsAt, endsAt, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function listAlerts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM weather_alerts ORDER BY starts_at DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function deleteAlert(req, res, next) {
  try {
    await pool.query('DELETE FROM weather_alerts WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Alert removed.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, deleteUser, getStats, createAlert, listAlerts, deleteAlert };