const pool = require('../config/db');

async function create({ userId, title, message, type = 'info' }) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, title, message, type]
  );
  return result.rows[0];
}

async function findByUser(userId, { unreadOnly = false } = {}) {
  const query = unreadOnly
    ? 'SELECT * FROM notifications WHERE user_id = $1 AND is_read = FALSE ORDER BY created_at DESC'
    : 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC';
  const result = await pool.query(query, [userId]);
  return result.rows;
}

async function markRead(id, userId) {
  const result = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0] || null;
}

module.exports = { create, findByUser, markRead };