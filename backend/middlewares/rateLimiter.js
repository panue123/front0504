const rateLimit = require('express-rate-limit');

// 1. Giới hạn đăng nhập - 5 lần sai trong 15 phút
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Giới hạn 5 lần thử
    message: {
        success: false,
        message: 'Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau 15 phút!'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 2. Giới hạn API chung - 100 request trong 15 phút
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request
    message: {
        success: false,
        message: 'Quá nhiều request. Vui lòng thử lại sau 15 phút!'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 3. Giới hạn đăng ký - 3 tài khoản trong 1 giờ
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 3, // Giới hạn 3 tài khoản
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 1 giờ!'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 4. Giới hạn reset password - 3 lần trong 1 giờ
const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 3, // Giới hạn 3 lần
    message: {
        success: false,
        message: 'Quá nhiều yêu cầu reset mật khẩu. Vui lòng thử lại sau 1 giờ!'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    apiLimiter,
    registerLimiter,
    resetPasswordLimiter
}; 