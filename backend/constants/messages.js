module.exports = {
    // Authentication messages
    AUTH: {
        INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
        TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
        TOKEN_INVALID: 'Token không hợp lệ',
        USER_NOT_FOUND: 'Không tìm thấy người dùng',
        USER_EXISTS: 'Email đã được sử dụng',
        INVALID_PASSWORD: 'Mật khẩu không chính xác',
        UNAUTHORIZED: 'Bạn không có quyền truy cập'
    },

    // Product messages
    PRODUCT: {
        NOT_FOUND: 'Không tìm thấy sản phẩm',
        EXISTS: 'Sản phẩm đã tồn tại',
        INVALID_PRICE: 'Giá sản phẩm không hợp lệ',
        INVALID_STOCK: 'Số lượng sản phẩm không hợp lệ',
        INVALID_CATEGORY: 'Danh mục không tồn tại',
        UPLOAD_FAILED: 'Upload sản phẩm thất bại'
    },

    // Category messages
    CATEGORY: {
        NOT_FOUND: 'Không tìm thấy danh mục',
        EXISTS: 'Danh mục đã tồn tại',
        HAS_PRODUCTS: 'Không thể xóa danh mục có sản phẩm'
    },

    // Cart messages
    CART: {
        ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm trong giỏ hàng',
        INVALID_QUANTITY: 'Số lượng sản phẩm không hợp lệ',
        PRODUCT_OUT_OF_STOCK: 'Sản phẩm hết hàng'
    },

    // Order messages
    ORDER: {
        NOT_FOUND: 'Không tìm thấy đơn hàng',
        INVALID_STATUS: 'Trạng thái đơn hàng không hợp lệ',
        INVALID_AMOUNT: 'Tổng tiền đơn hàng không hợp lệ',
        PROCESSING_FAILED: 'Xử lý đơn hàng thất bại'
    },

    // Upload messages
    UPLOAD: {
        INVALID_FILE: 'File không hợp lệ',
        FILE_TOO_LARGE: 'File quá lớn',
        INVALID_TYPE: 'Loại file không được hỗ trợ',
        FAILED: 'Upload file thất bại'
    },

    // Validation messages
    VALIDATION: {
        ERROR: 'Dữ liệu không hợp lệ',
        INVALID_INPUT: 'Dữ liệu đầu vào không hợp lệ',
        MISSING_FIELD: 'Thiếu thông tin bắt buộc'
    },

    // Database messages
    DB: {
        CONNECTION_ERROR: 'Lỗi kết nối database',
        QUERY_ERROR: 'Lỗi truy vấn database',
        TRANSACTION_ERROR: 'Lỗi giao dịch database'
    },

    // Redis messages
    REDIS: {
        CONNECTION_ERROR: 'Lỗi kết nối Redis',
        OPERATION_ERROR: 'Lỗi thao tác Redis',
        KEY_NOT_FOUND: 'Không tìm thấy dữ liệu trong cache'
    },

    // Server messages
    SERVER: {
        ERROR: 'Lỗi server',
        MAINTENANCE: 'Server đang bảo trì',
        RATE_LIMIT: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
    },

    // Success messages
    SUCCESS: {
        CREATED: 'Tạo mới thành công',
        UPDATED: 'Cập nhật thành công',
        DELETED: 'Xóa thành công',
        LOGIN: 'Đăng nhập thành công',
        LOGOUT: 'Đăng xuất thành công',
        UPLOAD: 'Upload thành công'
    }
}; 