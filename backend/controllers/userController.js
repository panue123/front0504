const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Đăng ký
const register = async (req, res) => {
    try {
        // Kiểm tra validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array() 
            });
        }

        const { username, password, fullname, email, phone } = req.body;

        // Kiểm tra username/email đã tồn tại
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username, email hoặc số điện thoại đã tồn tại!'
            });
        }

        try {
            // Tạo user mới với is_active = false (chờ admin duyệt)
            const user = await User.create({
                username,
                password,
                fullname,
                email,
                phone,
                is_active: false // Mặc định là chưa kích hoạt
            });

            res.status(201).json({
                message: 'Đăng ký thành công! Vui lòng đợi admin phê duyệt tài khoản.'
            });
        } catch (validationError) {
            // Bắt lỗi validation từ Sequelize
            if (validationError.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Dữ liệu không hợp lệ',
                    errors: validationError.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
            throw validationError;
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        // Kiểm tra validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array() 
            });
        }

        const { username, password } = req.body;

        // Tìm user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({
                message: 'Username hoặc mật khẩu không đúng!'
            });
        }

        // Kiểm tra tài khoản đã được kích hoạt chưa
        if (!user.is_active) {
            return res.status(403).json({
                message: 'Tài khoản chưa được kích hoạt! Vui lòng đợi admin phê duyệt.'
            });
        }

        // Kiểm tra password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Username hoặc mật khẩu không đúng!'
            });
        }

        // Cập nhật thời gian đăng nhập
        user.last_login = new Date();
        await user.save();

        // Tạo token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Đổi mật khẩu (yêu cầu đăng nhập)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy user!'
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không đúng!'
            });
        }

        try {
            // Cập nhật mật khẩu mới
            user.password = newPassword;
            await user.save();

            res.json({
                message: 'Đổi mật khẩu thành công!'
            });
        } catch (validationError) {
            // Bắt lỗi validation từ Sequelize
            if (validationError.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Mật khẩu mới không hợp lệ',
                    errors: validationError.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
            throw validationError;
        }
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// API cho User: Yêu cầu reset mật khẩu
const requestPasswordReset = async (req, res) => {
    try {
        const { username } = req.body;

        // Tìm user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản!'
            });
        }

        // Cập nhật trạng thái yêu cầu reset mật khẩu
        user.reset_password_requested = true;
        user.reset_password_requested_at = new Date();
        await user.save();

        res.json({
            message: 'Yêu cầu đặt lại mật khẩu đã được gửi tới admin. Vui lòng chờ phản hồi!'
        });
    } catch (error) {
        console.error('Lỗi yêu cầu reset mật khẩu:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// API cho Admin: Lấy danh sách yêu cầu reset mật khẩu
const getPasswordResetRequests = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { 
                reset_password_requested: true 
            },
            attributes: ['id', 'username', 'fullname', 'email', 'phone', 'reset_password_requested_at'],
            order: [['reset_password_requested_at', 'DESC']]
        });

        res.json(users);
    } catch (error) {
        console.error('Lỗi lấy danh sách yêu cầu reset mật khẩu:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// API cho Admin: Reset mật khẩu về mặc định
const resetPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const defaultPassword = "88888888";
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "Không tìm thấy user" 
            });
        }

        // Hash và update password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await user.update({ 
            password: hashedPassword,
            must_change_password: true  // Bắt buộc đổi mật khẩu khi đăng nhập lại
        });

        // Trả về thông tin để admin thông báo cho user
        res.json({
            success: true,
            message: "Đã reset mật khẩu thành công",
            user: {
                username: user.username,
                fullname: user.fullname,
                phone: user.phone,
                newPassword: defaultPassword
            },
            note: "Vui lòng thông báo mật khẩu mới cho user"
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi khi reset mật khẩu" 
        });
    }
};

// API cho Admin: Lấy danh sách tất cả users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'fullname', 'email', 'phone', 'is_active', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        res.json(users);
    } catch (error) {
        console.error('Lỗi lấy danh sách user:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// API cho Admin: Kích hoạt/vô hiệu hóa tài khoản
const toggleUserActive = async (req, res) => {
    try {
        const { userId } = req.params;
        const { is_active } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy user!'
            });
        }

        // Cập nhật trạng thái
        user.is_active = is_active;
        await user.save();

        res.json({
            message: `Tài khoản đã được ${is_active ? 'kích hoạt' : 'vô hiệu hóa'}!`,
            user: {
                id: user.id,
                username: user.username,
                is_active: user.is_active
            }
        });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái user:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Thêm middleware kiểm tra bắt buộc đổi mật khẩu
const checkMustChangePassword = async (req, res, next) => {
    if (req.user && req.user.must_change_password) {
        return res.status(403).json({
            success: false,
            message: "Vui lòng đổi mật khẩu trước khi tiếp tục sử dụng",
            must_change_password: true
        });
    }
    next();
};

module.exports = {
    register,
    login,
    changePassword,
    requestPasswordReset,
    getPasswordResetRequests,
    resetPassword,
    getAllUsers,
    toggleUserActive,
    checkMustChangePassword
};
