const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');
const weather = require('../controllers/weatherController');

const router = express.Router();

router.get('/current', optionalAuth, weather.getCurrent);
router.get('/forecast', optionalAuth, weather.getForecast);
router.get('/history', requireAuth, weather.getHistory);

module.exports = router;