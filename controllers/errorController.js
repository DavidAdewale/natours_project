const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const { path, value } = err;
  // console.log(`Cast error occurred - Path: ${path}, Value: ${value}`);
  const message = `Invalid ${path}: ${value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      error: err,
    });
  }
};

const handleDuplicateErrorCodeDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use a unique value`;
  return new AppError(message, 404);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const trimmedNodeEnv = process.env.NODE_ENV.trim();
  if (trimmedNodeEnv === 'development') {
    sendErrorDev(err, res);
  } else if (trimmedNodeEnv === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorCodeDB(error);
    sendErrorProd(error, res);
  }
};
