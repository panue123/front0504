const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực!'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra user có tồn tại và là admin
        const user = await User.findByPk(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện chức năng này!'
            });
        }

        // Lưu thông tin user vào request
        req.user = user;
        next();
    } catch (error) {
        console.error('Lỗi xác thực admin:', error);
        res.status(401).json({
            message: 'Token không hợp lệ!'
        });
    }
};

module.exports = { isAdmin }; 