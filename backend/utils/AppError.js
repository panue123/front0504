const { errorCodes, messages } = require('../constants');

class AppError extends Error {
    constructor(code, message, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(code, message) {
        return new AppError(code, message, 400);
    }

    static unauthorized(code, message) {
        return new AppError(code, message, 401);
    }

    static forbidden(code, message) {
        return new AppError(code, message, 403);
    }

    static notFound(code, message) {
        return new AppError(code, message, 404);
    }

    static conflict(code, message) {
        return new AppError(code, message, 409);
    }

    static internal(code, message) {
        return new AppError(code, message, 500);
    }

    static validationError(message) {
        return new AppError(errorCodes.VALIDATION_ERROR, message, 400);
    }

    static databaseError(message) {
        return new AppError(errorCodes.DB_QUERY_ERROR, message, 500);
    }

    static redisError(message) {
        return new AppError(errorCodes.REDIS_OPERATION_ERROR, message, 500);
    }

    static uploadError(message) {
        return new AppError(errorCodes.UPLOAD_FAILED, message, 400);
    }
}

module.exports = AppError; 