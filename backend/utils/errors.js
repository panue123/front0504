/**
 * Custom error classes để xử lý các loại lỗi khác nhau trong ứng dụng
 */

// Lỗi validation (kiểm tra dữ liệu đầu vào)
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
// Lỗi trùng lặp dữ liệu (username, email, phone đã tồn tại)
class DuplicateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateError';
        this.statusCode = 409;
    }
}

// Lỗi xác thực (token không hợp lệ, hết hạn)
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

// Lỗi phân quyền (không đủ quyền truy cập)
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403;
    }
}

// Lỗi không tìm thấy dữ liệu
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

// Lỗi vượt quá giới hạn request
class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RateLimitError';
        this.statusCode = 429;
    }
}

// Lỗi server
class ServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServerError';
        this.statusCode = 500;
    }
}

module.exports = {
    ValidationError,
    DuplicateError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    RateLimitError,
    ServerError,
    UnauthorizedError
};