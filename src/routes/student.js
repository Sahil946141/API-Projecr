const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { getMyAppointments } = require('../controllers/studentController');

const router = express.Router();

router.get('/me/appointments', authMiddleware, requireRole('student'), getMyAppointments);

module.exports = router;
