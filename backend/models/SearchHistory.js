const pool = require('../config/db');

async function create({ userId, cityName, country, temperature, condition }) {
  const result = await pool.query(
    `INSERT INTO search_history (user_id, city_name, country, temperature, condition)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, cityName, country, temperature, condition]
  );
  return result.rows[0];
}

async function findByUser(userId, limit = 50) {
  const result = await pool.query(
    `SELECT id, city_name, country, temperature, condition, searched_at
     FROM search_history WHERE user_id = $1
     ORDER BY searched_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function count() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM search_history');
  return result.rows[0].count;
}

async function topCities(limit = 10) {
  const result = await pool.query(
    `SELECT city_name, COUNT(*)::int AS searches
     FROM search_history GROUP BY city_name
     ORDER BY searches DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

module.exports = { create, findByUser, count, topCities };