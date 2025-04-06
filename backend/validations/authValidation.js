const { body } = require('express-validator');

const registerValidation = [
    // Username: ít nhất 3 ký tự, không có ký tự đặc biệt
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username phải có ít nhất 3 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới'),

    // Password: ít nhất 8 ký tự, có chữ hoa, chữ thường, số
    body('password')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),

    // Email hợp lệ
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),

    // Số điện thoại Việt Nam
    body('phone')
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
        .withMessage('Số điện thoại không hợp lệ'),

    // Họ tên không được trống
    body('fullname')
        .notEmpty()
        .withMessage('Họ tên không được để trống')
        .isLength({ min: 2 })
        .withMessage('Họ tên phải có ít nhất 2 ký tự')
];

const loginValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username không được để trống'),
    body('password')
        .notEmpty()
        .withMessage('Password không được để trống')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Mật khẩu hiện tại không được để trống'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu mới phải có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số')
];

module.exports = {
    registerValidation,
    loginValidation,
    changePasswordValidation
}; 