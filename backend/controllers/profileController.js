const pool = require('../config/db');

function sanitizeUser(user) {
  const { password_hash, reset_token, reset_token_expires, ...safe } = user;
  return safe;
}

async function getProfile(req, res, next) {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const settingsResult = await pool.query('SELECT * FROM settings WHERE user_id = $1', [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      data: {
        user: sanitizeUser(userResult.rows[0]),
        settings: settingsResult.rows[0] || null,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { fullName, avatarUrl } = req.body;
    const result = await pool.query(
      `UPDATE users SET full_name = COALESCE($1, full_name),
                         avatar_url = COALESCE($2, avatar_url),
                         updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [fullName, avatarUrl, req.user.id]
    );
    res.json({ success: true, data: sanitizeUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { theme, tempUnit, windUnit, language, notificationsEnabled } = req.body;
    const result = await pool.query(
      `UPDATE settings SET
         theme = COALESCE($1, theme),
         temp_unit = COALESCE($2, temp_unit),
         wind_unit = COALESCE($3, wind_unit),
         language = COALESCE($4, language),
         notifications_enabled = COALESCE($5, notifications_enabled),
         updated_at = NOW()
       WHERE user_id = $6 RETURNING *`,
      [theme, tempUnit, windUnit, language, notificationsEnabled, req.user.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, updateSettings };