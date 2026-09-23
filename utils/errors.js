const DEFAULT_ERROR_STATUS = 500;
const VALIDATION_ERROR_STATUS = 400;
const CAST_ERROR_STATUS = 400;
const UNAUTHORIZED_ERROR_STATUS = 401;
const FORBIDDEN_ERROR_STATUS = 403;
const NOT_FOUND_ERROR_STATUS = 404;
const CONFLICT_ERROR_STATUS = 409;

const createErrorConstructor = (name, statusCode, defaultMessage) => {
  const ErrorConstructor = function ErrorConstructor(message = defaultMessage) {
    const error = new Error(message);
    error.name = name;
    error.statusCode = statusCode;
    return error;
  };

  return ErrorConstructor;
};

const BadRequestError = createErrorConstructor(
  "BadRequestError",
  VALIDATION_ERROR_STATUS,
  "Invalid data"
);
const UnauthorizedError = createErrorConstructor(
  "UnauthorizedError",
  UNAUTHORIZED_ERROR_STATUS,
  "Unauthorized"
);
const ForbiddenError = createErrorConstructor(
  "ForbiddenError",
  FORBIDDEN_ERROR_STATUS,
  "Forbidden"
);
const NotFoundError = createErrorConstructor(
  "NotFoundError",
  NOT_FOUND_ERROR_STATUS,
  "Requested resource not found"
);
const ConflictError = createErrorConstructor(
  "ConflictError",
  CONFLICT_ERROR_STATUS,
  "Conflict error"
);

const ERROR_STATUS_MAP = {
  ValidationError: VALIDATION_ERROR_STATUS,
  CastError: CAST_ERROR_STATUS,
  DocumentNotFoundError: NOT_FOUND_ERROR_STATUS,
};

const createErrorResponse = (
  err,
  fallbackMessage = "An unexpected error occurred."
) => {
  let statusCode = DEFAULT_ERROR_STATUS;

  if (err && err.name && ERROR_STATUS_MAP[err.name]) {
    statusCode = ERROR_STATUS_MAP[err.name];
  } else if (err && err.statusCode) {
    statusCode = err.statusCode;
  }

  return {
    statusCode,
    message: err && err.message ? err.message : fallbackMessage,
  };
};

const handleError = (
  res,
  err,
  fallbackMessage = "An unexpected error occurred."
) => {
  const { statusCode, message } = createErrorResponse(err, fallbackMessage);
  return res.status(statusCode).send({ message });
};

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  createErrorResponse,
  handleError,
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  UNAUTHORIZED_ERROR_STATUS,
  FORBIDDEN_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
  CONFLICT_ERROR_STATUS,
};
