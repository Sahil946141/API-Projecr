const CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SLOT_ALREADY_BOOKED: 'SLOT_ALREADY_BOOKED',
};

class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

function badRequest(code, message) {
  return new AppError(400, code || CODES.INVALID_INPUT, message);
}

function unauthorized(message = 'Missing or invalid token') {
  return new AppError(401, CODES.UNAUTHORIZED, message);
}

function forbidden(message = 'Not allowed') {
  return new AppError(403, CODES.FORBIDDEN, message);
}

function notFound(message = 'Not found') {
  return new AppError(404, CODES.NOT_FOUND, message);
}

function conflict(code, message) {
  return new AppError(409, code || CODES.CONFLICT, message);
}

module.exports = {
  CODES,
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
