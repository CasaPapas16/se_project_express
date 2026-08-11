const DEFAULT_ERROR_STATUS = 500;
const VALIDATION_ERROR_STATUS = 400;
const CAST_ERROR_STATUS = 400;
const NOT_FOUND_ERROR_STATUS = 404;
const CONFLICT_ERROR_STATUS = 409;

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
  createErrorResponse,
  handleError,
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
  CONFLICT_ERROR_STATUS,
};
