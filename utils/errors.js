const DEFAULT_ERROR_STATUS = 500;

const ERROR_STATUS_MAP = {
  ValidationError: 400,
  CastError: 400,
  DocumentNotFoundError: 404,
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

module.exports = { createErrorResponse, handleError };
