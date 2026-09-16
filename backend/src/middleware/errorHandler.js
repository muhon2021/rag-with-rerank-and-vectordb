export class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  } else {
    console.error(`[${code}] ${message}`);
  }

  res.status(statusCode).json({
    error: message,
    code,
    ...(err.details && { details: err.details }),
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function requestTimeout(ms = 30000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent && !res.writableEnded) {
        res.status(504).json({
          error: 'Request took too long. Please try again.',
          code: 'TIMEOUT',
        });
      }
    }, ms);

    const clear = () => clearTimeout(timer);
    res.on('finish', clear);
    res.on('close', clear);

    next();
  };
}
