const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { body } = require('express-validator');

// Route đổi mật khẩu (yêu cầu đăng nhập)
router.post('/change-password', 
    auth,
    [
        body('currentPassword')
            .notEmpty()
            .withMessage('Vui lòng nhập mật khẩu hiện tại!'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự!')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
            .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!')
    ],
    userController.changePassword
);

// Route yêu cầu reset mật khẩu (không yêu cầu đăng nhập)
router.post('/request-password-reset',
    [
        body('username')
            .notEmpty()
            .withMessage('Vui lòng nhập username!')
    ],
    userController.requestPasswordReset
);

module.exports = router; 