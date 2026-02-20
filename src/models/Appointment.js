const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'AvailabilitySlot', required: true, unique: true },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
    cancelledBy: { type: String, enum: ['professor', 'student'], default: null },
    cancelReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
