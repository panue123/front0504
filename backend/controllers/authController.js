const authService = require('../services/authService');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

class authController {
    static async register(req, res) {
        console.log('Received body:', req.body);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array()); 
                throw new ValidationError('Dữ liệu không hợp lệ');
                
            }

            const result = await authService.register(req.body);

            return res.status(201).json({
                success: true,
                message: 'Đăng ký thành công!',
                data: result
            });

        } catch (error) {
            console.error('Error:', error);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Có lỗi xảy ra, vui lòng thử lại sau!'
            });
        }
    }
    
}

module.exports = authController;

