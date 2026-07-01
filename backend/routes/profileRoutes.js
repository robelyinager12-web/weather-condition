const express = require('express');
const { requireAuth } = require('../middleware/auth');
const profile = require('../controllers/profileController');

const router = express.Router();

router.use(requireAuth);

router.get('/', profile.getProfile);
router.put('/', profile.updateProfile);
router.put('/settings', profile.updateSettings);

module.exports = router;