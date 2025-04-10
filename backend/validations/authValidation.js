const { body } = require('express-validator');

/**
 * Validation rules cho đăng ký tài khoản
 */
const registerValidation = [
    // Validate username
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập username!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username phải từ 3-20 ký tự!')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới!')
        .escape(),

    // Validate password
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu!')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự!')
        .matches(/\d/)
        .withMessage('Mật khẩu phải chứa ít nhất 1 số!')
        .matches(/[a-z]/)
        .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường!')
        .matches(/[A-Z]/)
        .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa!'),

    // Validate password confirmation
    body('confirmPassword')
        .notEmpty()
        .withMessage('Vui lòng xác nhận mật khẩu!')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không khớp!');
            }
            return true;
        }),

    // Validate fullname
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập họ tên!')
        .isLength({ min: 2, max: 50 })
        .withMessage('Họ tên phải từ 2-50 ký tự!')
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
        .withMessage('Họ tên chỉ được chứa chữ cái và khoảng trắng!')
        .escape(),

    // Validate email
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập email!')
        .isEmail()
        .withMessage('Email không hợp lệ!')
        .normalizeEmail(),

    // Validate phone
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập số điện thoại!')
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})\b/)
        .withMessage('Số điện thoại không hợp lệ! (VD: 0912345678)')
        .escape()
];

/**
 * Validation rules cho đăng nhập
 */
const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập username!')
        .escape(),
    
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu!')
];

/**
 * Validation rules cho đổi mật khẩu
 */
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu hiện tại!'),

    body('newPassword')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu mới!')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự!')
        .matches(/\d/)
        .withMessage('Mật khẩu mới phải chứa ít nhất 1 số!')
        .matches(/[a-z]/)
        .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ thường!')
        .matches(/[A-Z]/)
        .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa!')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
            }
            return true;
        }),

    body('confirmNewPassword')
        .notEmpty()
        .withMessage('Vui lòng xác nhận mật khẩu mới!')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Xác nhận mật khẩu mới không khớp!');
            }
            return true;
        })
];

module.exports = {
    registerValidation,
    loginValidation,
    changePasswordValidation
};