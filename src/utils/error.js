class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.code = 401;
    this.message = message;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.code = 403;
    this.message = message;
  }
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
    this.code = 440;
    this.message = message;
  }
}

module.exports = {
  UnauthorizedError,
  ForbiddenError,
  TimeoutError
};
