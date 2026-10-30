const { createErrorResponse } = require("../utils/errors");

const errorHandler = (err, res) => {
  console.error(err);
  const { statusCode, message } = createErrorResponse(err);
  return res.status(statusCode).send({ message });
};

module.exports = errorHandler;
