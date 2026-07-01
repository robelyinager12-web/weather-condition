const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/db');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  const { password_hash, reset_token, reset_token_expires, ...safe } = user;
  return safe;
}

async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING *`,
      [fullName, email, passwordHash]
    );

    const user = result.rows[0];
    await pool.query('INSERT INTO settings (user_id) VALUES ($1)', [user.id]);

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: sanitizeUser(user), accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: { user: sanitizeUser(user), accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT: logout is handled client-side by discarding the token.
  // For token revocation, maintain a denylist table keyed by token jti.
  res.json({ success: true, message: 'Logged out successfully.' });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    // Always respond the same way to avoid leaking which emails are registered.
    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expires, email]
    );

    // TODO: send the reset link via an email provider (SendGrid, SES, etc.)
    // Reset link format: `${process.env.CLIENT_URL}/reset-password?token=${token}`
    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.',
      devToken: process.env.NODE_ENV === 'development' ? token : undefined,
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword };