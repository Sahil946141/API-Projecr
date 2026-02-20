const AvailabilitySlot = require('../models/AvailabilitySlot');
const Appointment = require('../models/Appointment');
const { badRequest, forbidden, notFound, conflict, CODES } = require('../utils/errors');

async function createAppointment(req, res, next) {
  try {
    const studentId = req.user._id;
    const { professorId, slotId } = req.body;
    if (!professorId || !slotId) {
      throw badRequest('INVALID_INPUT', 'professorId and slotId are required');
    }
    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) throw notFound('Slot not found');
    if (slot.professorId.toString() !== professorId) {
      throw badRequest('INVALID_INPUT', 'Slot does not belong to this professor');
    }
    // Atomic update: only update if slot is still free (prevents double-booking)
    const updated = await AvailabilitySlot.findOneAndUpdate(
      { _id: slotId, status: 'free' },
      { status: 'booked' },
      { new: true }
    );
    if (!updated) {
      throw conflict(CODES.SLOT_ALREADY_BOOKED, 'Slot is already booked');
    }
    // Create appointment
    const appointment = await Appointment.create({
      professorId,
      studentId,
      slotId,
      status: 'booked',
    });
    // link slot to appointment
    await AvailabilitySlot.updateOne(
      { _id: slotId },
      { $set: { appointmentId: appointment._id } }
    );
    const populated = await Appointment.findById(appointment._id)
      .populate('slotId', 'startTime endTime')
      .lean();
    res.status(201).json({
      success: true,
      data: {
        id: populated._id,
        professorId: populated.professorId,
        studentId: populated.studentId,
        slotId: populated.slotId._id,
        status: populated.status,
        startTime: populated.slotId.startTime,
        endTime: populated.slotId.endTime,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const professorId = req.user._id;
    const { appointmentId } = req.params;
    const { reason } = req.body || {};
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw notFound('Appointment not found');
    if (appointment.professorId.toString() !== professorId.toString()) {
      throw forbidden('You can only cancel your own appointments');
    }
    if (appointment.status === 'cancelled') {
      return res.json({
        success: true,
        data: { message: 'Appointment already cancelled', appointment },
      });
    }
    // update appointment to cancelled
    await Appointment.updateOne(
      { _id: appointmentId },
      {
        status: 'cancelled',
        cancelledBy: 'professor',
        cancelReason: reason || undefined,
      }
    );
    // free up the slot
    await AvailabilitySlot.updateOne(
      { _id: appointment.slotId },
      { status: 'free', appointmentId: null }
    );
    const updated = await Appointment.findById(appointmentId).lean();
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAppointment, cancelAppointment };
