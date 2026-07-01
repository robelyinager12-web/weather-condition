const User = require('../models/User');
const Setting = require('../models/Setting');

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const settings = await Setting.findByUserId(req.user.id);

    res.json({
      success: true,
      data: { user: User.sanitize(user), settings },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { fullName, avatarUrl } = req.body;
    const user = await User.updateProfile(req.user.id, { fullName, avatarUrl });
    res.json({ success: true, data: User.sanitize(user) });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { theme, tempUnit, windUnit, language, notificationsEnabled } = req.body;
    const settings = await Setting.update(req.user.id, {
      theme,
      tempUnit,
      windUnit,
      language,
      notificationsEnabled,
    });
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, updateSettings };