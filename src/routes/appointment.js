const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { createAppointment, cancelAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', authMiddleware, requireRole('student'), createAppointment);
router.post('/:appointmentId/cancel', authMiddleware, requireRole('professor'), cancelAppointment);

module.exports = router;
