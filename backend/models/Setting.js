const pool = require('../config/db');

async function createDefault(userId) {
  const result = await pool.query('INSERT INTO settings (user_id) VALUES ($1) RETURNING *', [userId]);
  return result.rows[0];
}

async function findByUserId(userId) {
  const result = await pool.query('SELECT * FROM settings WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
}

async function update(userId, { theme, tempUnit, windUnit, language, notificationsEnabled }) {
  const result = await pool.query(
    `UPDATE settings SET
       theme = COALESCE($1, theme),
       temp_unit = COALESCE($2, temp_unit),
       wind_unit = COALESCE($3, wind_unit),
       language = COALESCE($4, language),
       notifications_enabled = COALESCE($5, notifications_enabled),
       updated_at = NOW()
     WHERE user_id = $6 RETURNING *`,
    [theme, tempUnit, windUnit, language, notificationsEnabled, userId]
  );
  return result.rows[0];
}

module.exports = { createDefault, findByUserId, update };