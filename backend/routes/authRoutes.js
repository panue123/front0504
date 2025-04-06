const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
    loginLimiter, 
    registerLimiter, 
    resetPasswordLimiter,
    apiLimiter 
} = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');
const { 
    registerValidation, 
    loginValidation, 
    changePasswordValidation 
} = require('../validations/authValidation');

// Áp dụng rate limiter chung cho tất cả các route
router.use(apiLimiter);

// Routes không cần xác thực
router.post('/register', registerLimiter, registerValidation, userController.register);
router.post('/login', loginLimiter, loginValidation, userController.login);
router.post('/forgot-password', resetPasswordLimiter, userController.forgotPassword);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);

// Routes cần xác thực
router.use(auth);
router.post('/change-password', changePasswordValidation, userController.changePassword);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/logout', userController.logout);

module.exports = router; 