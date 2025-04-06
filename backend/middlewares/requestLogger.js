const { logRequest, logResponse } = require('../utils/logger');

const requestLogger = (req, res, next) => {
    // Lưu thời điểm bắt đầu request
    const start = Date.now();

    // Log request
    logRequest(req);

    // Ghi đè hàm end của response để log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding, callback) {
        // Tính thời gian phản hồi
        const responseTime = Date.now() - start;

        // Log response
        logResponse(req, res, responseTime);

        // Gọi hàm end gốc
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};

module.exports = requestLogger; 