// Server configuration
const SERVER = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

// Database configuration
const DB = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASS || '',
    NAME: process.env.DB_NAME || 'shop_db'
};

// JWT configuration
const JWT = {
    SECRET: process.env.JWT_SECRET || 'hina_shop_jwt_secret_key_2024_secure_token',
    EXPIRES_IN: '24h'
};

// Cloudinary configuration
const CLOUDINARY = {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
};

// Redis configuration
const REDIS = {
    URL: process.env.REDIS_URL || 'redis://localhost:6379'
};

// CORS configuration
const CORS = {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Rate limiting configuration
const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    LOGIN: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        MAX_REQUESTS: 5
    }
};

// File upload configuration
const UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    FOLDER: 'products'
};

// Status codes
const STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Messages
const MESSAGES = {
    // Auth messages
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công!',
    PASSWORD_RESET_SENT: 'Đã gửi email đặt lại mật khẩu!',
    PASSWORD_RESET_SUCCESS: 'Đặt lại mật khẩu thành công!',
    INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng!',
    ACCOUNT_INACTIVE: 'Tài khoản chưa được kích hoạt!',
    TOKEN_EXPIRED: 'Token đã hết hạn!',
    TOKEN_INVALID: 'Token không hợp lệ!',

    // User messages
    USER_NOT_FOUND: 'Không tìm thấy người dùng!',
    USER_UPDATED: 'Cập nhật thông tin thành công!',
    USER_ACTIVATED: 'Kích hoạt tài khoản thành công!',
    USER_CREATED: 'Tạo tài khoản thành công!',
    USER_DELETED: 'Xóa tài khoản thành công!',
    USERNAME_EXISTS: 'Tên đăng nhập đã tồn tại!',
    EMAIL_EXISTS: 'Email đã tồn tại!',
    CANNOT_DELETE_ADMIN: 'Không thể xóa tài khoản admin!',

    // Product messages
    PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm!',
    PRODUCT_CREATED: 'Thêm sản phẩm thành công!',
    PRODUCT_UPDATED: 'Cập nhật sản phẩm thành công!',
    PRODUCT_DELETED: 'Xóa sản phẩm thành công!',

    // Category messages
    CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục!',
    CATEGORY_CREATED: 'Thêm danh mục thành công!',
    CATEGORY_UPDATED: 'Cập nhật danh mục thành công!',
    CATEGORY_DELETED: 'Xóa danh mục thành công!',
    CATEGORY_HAS_PRODUCTS: 'Không thể xóa danh mục đang có sản phẩm!',

    // Order messages
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng!',
    ORDER_CREATED: 'Tạo đơn hàng thành công!',
    ORDER_UPDATED: 'Cập nhật đơn hàng thành công!',
    ORDER_DELETED: 'Xóa đơn hàng thành công!',

    // Error messages
    SERVER_ERROR: 'Lỗi server!',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ!',
    UNAUTHORIZED: 'Bạn không có quyền thực hiện chức năng này!',
    RATE_LIMIT_EXCEEDED: 'Quá nhiều yêu cầu, vui lòng thử lại sau!',
    FILE_TOO_LARGE: 'File quá lớn!',
    INVALID_FILE_TYPE: 'Loại file không được hỗ trợ!'
};

module.exports = {
    SERVER,
    DB,
    JWT,
    CLOUDINARY,
    REDIS,
    CORS,
    RATE_LIMIT,
    UPLOAD,
    STATUS,
    MESSAGES
}; 