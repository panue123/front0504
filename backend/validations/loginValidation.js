const { body } = require('express-validator');

const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập username!'),
    
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu!')
];

module.exports = loginValidation;
