const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../controllers/authController');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed.', errors: errors.array() });
  }
  next();
}

router.post(
  '/register',
  [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters.'),
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  ],
  validate,
  auth.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  auth.login
);

router.post('/logout', auth.logout);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('A valid email is required.').normalizeEmail()],
  validate,
  auth.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  ],
  validate,
  auth.resetPassword
);

module.exports = router;