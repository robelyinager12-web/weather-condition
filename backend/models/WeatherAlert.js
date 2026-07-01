const pool = require('../config/db');

async function findAll(limit = 100) {
  const result = await pool.query(
    'SELECT * FROM weather_alerts ORDER BY starts_at DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

async function findByCity(cityName) {
  const result = await pool.query(
    `SELECT * FROM weather_alerts
     WHERE city_name ILIKE $1 AND (ends_at IS NULL OR ends_at > NOW())
     ORDER BY starts_at DESC`,
    [cityName]
  );
  return result.rows;
}

async function create({ cityName, alertType, severity, message, startsAt, endsAt, createdBy }) {
  const result = await pool.query(
    `INSERT INTO weather_alerts (city_name, alert_type, severity, message, starts_at, ends_at, created_by)
     VALUES ($1, $2, $3, $4, COALESCE($5, NOW()), $6, $7) RETURNING *`,
    [cityName, alertType, severity, message, startsAt, endsAt, createdBy]
  );
  return result.rows[0];
}

async function remove(id) {
  await pool.query('DELETE FROM weather_alerts WHERE id = $1', [id]);
}

async function count() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM weather_alerts');
  return result.rows[0].count;
}

module.exports = { findAll, findByCity, create, remove, count };