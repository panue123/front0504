const { logger } = require('./logger');

// Xử lý lỗi Sequelize
const handleSequelizeError = (error) => {
    if (error.name === 'SequelizeValidationError') {
        return {
            status: 400,
            message: 'Dữ liệu không hợp lệ!',
            errors: error.errors.map(err => ({
                field: err.path,
                message: err.message
            }))
        };
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return {
            status: 400,
            message: 'Dữ liệu đã tồn tại!',
            errors: error.errors.map(err => ({
                field: err.path,
                message: `${err.path} đã tồn tại!`
            }))
        };
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return {
            status: 400,
            message: 'Không thể xóa dữ liệu đang được sử dụng!'
        };
    }

    return {
        status: 500,
        message: 'Lỗi database!',
        error: error.message
    };
};

// Xử lý lỗi JWT
const handleJWTError = (error) => {
    if (error.name === 'JsonWebTokenError') {
        return {
            status: 401,
            message: 'Token không hợp lệ!'
        };
    }

    if (error.name === 'TokenExpiredError') {
        return {
            status: 401,
            message: 'Token đã hết hạn!'
        };
    }

    return {
        status: 401,
        message: 'Lỗi xác thực!',
        error: error.message
    };
};

// Xử lý lỗi Cloudinary
const handleCloudinaryError = (error) => {
    return {
        status: 500,
        message: 'Lỗi upload file!',
        error: error.message
    };
};

// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
    // Log lỗi
    logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });

    let errorResponse;

    // Xử lý các loại lỗi
    if (err.name && err.name.includes('Sequelize')) {
        errorResponse = handleSequelizeError(err);
    } else if (err.name && err.name.includes('JsonWebToken')) {
        errorResponse = handleJWTError(err);
    } else if (err.name === 'CloudinaryError') {
        errorResponse = handleCloudinaryError(err);
    } else {
        errorResponse = {
            status: err.status || 500,
            message: err.message || 'Có lỗi xảy ra!',
            error: process.env.NODE_ENV === 'development' ? err : {}
        };
    }

    res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandler; 