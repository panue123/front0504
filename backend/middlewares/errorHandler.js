const { logger } = require('../utils/logger');
const AppError = require('../utils/AppError');
const { messages } = require('../constants');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user ? req.user.id : null
    });

    // Development error response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
        return;
    }

    // Production error response
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            code: err.code,
            message: err.message
        });
        return;
    }

    // Programming or unknown errors
    console.error('ERROR 💥', err);
    res.status(500).json({
        status: 'error',
        code: 'SERVER_ERROR',
        message: messages.SERVER.ERROR
    });
};

module.exports = errorHandler; 