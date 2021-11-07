const { logger } = require("../config");

function errorResponse(
  res,
  statusCode,
  error,
  message = "An error occurred",
  status = "error"
) {
  const responseObject = {
    status,
    error,
    message,
  };
  logger.error(message);
  return res.status(statusCode).send(responseObject);
}

function successResponse(
  res,
  status,
  message,
  data = [],
) {
  const responseObject = {
    status,
    data,
    message,
  };
  logger.info(message);
  return res.status(status).send(responseObject);
}

module.exports = {
  errorResponse,
  successResponse,
};
