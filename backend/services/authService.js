const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { DuplicateError, ValidationError, ServerError } = require('../utils/errors');

class authService {
    static async register(userData) {
        try {
            const { username, password, fullname, email, phone } = userData;

            // Kiểm tra user đã tồn tại
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
                throw new DuplicateError('Username, email hoặc số điện thoại đã tồn tại!');
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo user mới
            const newUser = await User.create({
                username,
                password: hashedPassword,
                fullname,
                email,
                phone,
                is_active: true
            });

            // Trả về thông tin không bao gồm password
            const { password: _, ...userWithoutPassword } = newUser.toJSON();
            return userWithoutPassword;

        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof DuplicateError) {
                throw error;
            }
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error.message);
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new DuplicateError('Username, email hoặc số điện thoại đã tồn tại!');
            }
            throw new ServerError('Lỗi server khi đăng ký tài khoản');
        }
    }
    
}

module.exports = authService;


