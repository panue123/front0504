const AppError = require('./AppError');

// Tạo lỗi 404
const createNotFoundError = (message = 'Không tìm thấy tài nguyên!') => {
    return new AppError(message, 404);
};

// Tạo lỗi 403
const createForbiddenError = (message = 'Bạn không có quyền thực hiện hành động này!') => {
    return new AppError(message, 403);
};

// Tạo lỗi 401
const createUnauthorizedError = (message = 'Bạn cần đăng nhập để thực hiện hành động này!') => {
    return new AppError(message, 401);
};

// Tạo lỗi 400
const createBadRequestError = (message) => {
    return new AppError(message, 400);
};

// Tạo lỗi 500
const createServerError = (message = 'Đã xảy ra lỗi!') => {
    return new AppError(message, 500);
};

// Kiểm tra và ném lỗi nếu không tìm thấy
const throwIfNotFound = (data, message) => {
    if (!data) {
        throw createNotFoundError(message);
    }
    return data;
};

// Kiểm tra và ném lỗi nếu không có quyền
const throwIfNotAuthorized = (condition, message) => {
    if (!condition) {
        throw createForbiddenError(message);
    }
};

// Kiểm tra và ném lỗi nếu chưa đăng nhập
const throwIfNotAuthenticated = (user, message) => {
    if (!user) {
        throw createUnauthorizedError(message);
    }
};

module.exports = {
    createNotFoundError,
    createForbiddenError,
    createUnauthorizedError,
    createBadRequestError,
    createServerError,
    throwIfNotFound,
    throwIfNotAuthorized,
    throwIfNotAuthenticated
}; 