const pool = require('../config/db');

async function findByUser(userId) {
  const result = await pool.query(
    'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function create({ userId, cityName, country, latitude, longitude }) {
  const result = await pool.query(
    `INSERT INTO favorites (user_id, city_name, country, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, cityName, country, latitude, longitude]
  );
  return result.rows[0];
}

async function remove(id, userId) {
  const result = await pool.query(
    'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
}

async function count() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM favorites');
  return result.rows[0].count;
}

module.exports = { findByUser, create, remove, count };