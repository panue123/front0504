const jwt = require('jsonwebtoken');
const LogoutService = require('../services/logoutService');
const User = require('../models/User'); 

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token!' });
    }

    if (LogoutService.isTokenRevoked(token)) {
        return res.status(401).json({ message: 'Token đã bị thu hồi!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        req.user = user; // Gắn toàn bộ user từ DB
        req.token = token;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Token không hợp lệ!' });
    }
};

module.exports = { authenticateToken };
