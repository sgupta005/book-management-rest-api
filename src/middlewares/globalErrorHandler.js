import { config } from '../config.js';

export default function globalErrorHandler(err, request, response, next) {
  const statusCode = err.statusCode || 500;

  return response.status(statusCode).json({
    message: err.message,
    stack: config.env === 'development' ? err.stack : '',
  });
}
