const rateLimit = require('express-rate-limit');
const { RateLimitError } = require('../utils/errors');

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 5, // Giới hạn 5 request mỗi IP
    handler: (req, res) => {
        throw new RateLimitError('Đã vượt quá giới hạn đăng ký (5 tài khoản/giờ). Vui lòng thử lại sau.');
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    registerLimiter
};