const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const Setting = require('../models/Setting');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ fullName, email, passwordHash });
    await Setting.createDefault(user.id);

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: User.sanitize(user), accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
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
      data: { user: User.sanitize(user), accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.json({ success: true, message: 'Logged out successfully.' });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await User.setResetToken(email, token, expires);

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

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.updatePassword(user.id, passwordHash);

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword };