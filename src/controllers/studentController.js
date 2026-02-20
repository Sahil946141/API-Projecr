const Appointment = require('../models/Appointment');
const { badRequest } = require('../utils/errors');

async function getMyAppointments(req, res, next) {
  try {
    const studentId = req.user._id;
    const status = req.query.status || 'booked';
    if (!['booked', 'cancelled'].includes(status)) {
      return next(badRequest('INVALID_INPUT', 'status must be booked or cancelled'));
    }
    const appointments = await Appointment.find({ studentId, status })
      .populate('professorId', 'name email')
      .populate('slotId', 'startTime endTime')
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      data: appointments.map((a) => ({
        id: a._id,
        professorId: a.professorId._id,
        professorName: a.professorId.name,
        slotId: a.slotId._id,
        startTime: a.slotId.startTime,
        endTime: a.slotId.endTime,
        status: a.status,
        cancelledBy: a.cancelledBy,
        cancelReason: a.cancelReason,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyAppointments };
