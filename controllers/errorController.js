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
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleDuplicateErrorCodeDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use a unique value`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpired = () =>
  new AppError('Youre token has expired! Please log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const trimmedNodeEnv = process.env.NODE_ENV.trim();
  if (trimmedNodeEnv === 'development') {
    sendErrorDev(err, res);
  } else if (trimmedNodeEnv === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorCodeDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, res);
  }
};
