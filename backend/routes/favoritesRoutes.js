const express = require('express');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const favorites = require('../controllers/favoritesController');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed.', errors: errors.array() });
  }
  next();
}

router.use(requireAuth);

router.get('/', favorites.listFavorites);

router.post(
  '/',
  [
    body('cityName').trim().notEmpty().withMessage('City name is required.'),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
  ],
  validate,
  favorites.addFavorite
);

router.delete('/:id', favorites.removeFavorite);

module.exports = router;