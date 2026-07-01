const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const admin = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/users', admin.listUsers);
router.delete('/users/:id', admin.deleteUser);
router.get('/stats', admin.getStats);
router.get('/alerts', admin.listAlerts);
router.post('/alerts', admin.createAlert);
router.delete('/alerts/:id', admin.deleteAlert);

module.exports = router;