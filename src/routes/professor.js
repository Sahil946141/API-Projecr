const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { createAvailability, getProfessorAvailability } = require('../controllers/professorController');

const router = express.Router();

router.post('/me/availability', authMiddleware, requireRole('professor'), createAvailability);
router.get('/:professorId/availability', authMiddleware, requireRole('student'), getProfessorAvailability);

module.exports = router;
