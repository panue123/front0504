const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const { logout } = require('../controllers/logoutController');

const loginValidation = require('../validations/loginValidation');
const { registerValidation } = require('../validations/authValidation');
const logoutValidation = require('../validations/logoutValidation');
const profileValidation = require('../validations/profileValidation');

const { validate } = require('../middlewares/validate');
const { registerLimiter } = require('../middlewares/rateLimiter');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/register', registerLimiter, ...registerValidation, authController.register);
router.post('/login', loginValidation, validate, loginController.login);
router.post('/logout', authenticateToken, logoutValidation, logout);
router.get('/profile', authenticateToken, profileController.getProfile);
router.put('/profile', authenticateToken, validate, profileController.updateProfile);

module.exports = router;
