const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Vui lòng đăng nhập' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Không tìm thấy user' 
            });
        }

        if (!user.is_active) {
            return res.status(403).json({ 
                success: false,
                message: 'Tài khoản đã bị khóa' 
            });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Không có quyền truy cập' 
        });
    }
};

module.exports = auth; 