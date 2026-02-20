const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['free', 'booked'], default: 'free' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);
