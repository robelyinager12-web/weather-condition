const pool = require('../config/db');

function sanitize(user) {
  if (!user) return null;
  const { password_hash, reset_token, reset_token_expires, ...safe } = user;
  return safe;
}

async function findByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ fullName, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3) RETURNING *`,
    [fullName, email, passwordHash]
  );
  return result.rows[0];
}

async function updateProfile(id, { fullName, avatarUrl }) {
  const result = await pool.query(
    `UPDATE users SET full_name = COALESCE($1, full_name),
                       avatar_url = COALESCE($2, avatar_url),
                       updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [fullName, avatarUrl, id]
  );
  return result.rows[0];
}

async function setResetToken(email, token, expires) {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
    [token, expires, email]
  );
}

async function findByResetToken(token) {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [token]
  );
  return result.rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [passwordHash, id]
  );
}

async function findAll() {
  const result = await pool.query(
    `SELECT id, full_name, email, role, is_active, created_at
     FROM users ORDER BY created_at DESC`
  );
  return result.rows;
}

async function deleteById(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

async function count() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  return result.rows[0].count;
}

module.exports = {
  sanitize,
  findByEmail,
  findById,
  create,
  updateProfile,
  setResetToken,
  findByResetToken,
  updatePassword,
  findAll,
  deleteById,
  count,
};