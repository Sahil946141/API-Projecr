const AvailabilitySlot = require('../models/AvailabilitySlot');
const { badRequest, forbidden, notFound } = require('../utils/errors');

function normalizeDate(d) {
  if (typeof d === 'string') return new Date(d);
  return d;
}

async function createAvailability(req, res, next) {
  try {
    const professorId = req.user._id;
    const { slots } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) {
      throw badRequest('INVALID_INPUT', 'slots array with at least one { startTime, endTime } is required');
    }
    const now = new Date();
    const toInsert = [];
    for (const s of slots) {
      const startTime = normalizeDate(s.startTime);
      const endTime = normalizeDate(s.endTime);
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw badRequest('INVALID_INPUT', 'startTime and endTime must be valid ISO dates');
      }
      if (startTime >= endTime) {
        throw badRequest('INVALID_INPUT', 'startTime must be before endTime');
      }
      if (startTime < now) {
        throw badRequest('INVALID_INPUT', 'Slots must be in the future');
      }
      toInsert.push({ professorId, startTime, endTime });
    }
    const existing = await AvailabilitySlot.find({
      professorId,
      status: 'free',
      $or: toInsert.map(({ startTime, endTime }) => ({
        $and: [
          { startTime: { $lt: endTime } },
          { endTime: { $gt: startTime } },
        ],
      })),
    });
    if (existing.length > 0) {
      throw badRequest('INVALID_INPUT', 'One or more slots overlap with existing availability');
    }
    const bookedOverlap = await AvailabilitySlot.find({
      professorId,
      status: 'booked',
      $or: toInsert.map(({ startTime, endTime }) => ({
        $and: [
          { startTime: { $lt: endTime } },
          { endTime: { $gt: startTime } },
        ],
      })),
    });
    if (bookedOverlap.length > 0) {
      throw badRequest('INVALID_INPUT', 'One or more slots overlap with existing availability');
    }
    const created = await AvailabilitySlot.insertMany(toInsert);
    res.status(201).json({
      success: true,
      data: created.map((slot) => ({
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function getProfessorAvailability(req, res, next) {
  try {
    const { professorId } = req.params;
    const { from, to } = req.query;
    const filter = {
      professorId,
      status: 'free',
    };
    if (from) {
      const fromDate = normalizeDate(from);
      if (!isNaN(fromDate.getTime())) filter.startTime = { $gte: fromDate };
    }
    if (to) {
      const toDate = normalizeDate(to);
      if (!isNaN(toDate.getTime())) filter.endTime = { $lte: toDate };
    }
    const slots = await AvailabilitySlot.find(filter)
      .sort({ startTime: 1 })
      .select('_id startTime endTime status')
      .lean();
    res.json({
      success: true,
      data: slots.map((s) => ({
        id: s._id,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAvailability, getProfessorAvailability };
