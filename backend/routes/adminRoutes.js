const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/isAdmin');
const { 
    getAllUsers, 
    toggleUserActive,
    resetPassword,
    getPasswordResetRequests 
} = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Protect all routes with isAdmin middleware
router.use(isAdmin);

// Get all users
router.get('/users', getAllUsers);

// Toggle user active status
router.patch('/users/:userId/toggle-active', toggleUserActive);

// Get password reset requests
router.get('/password-reset-requests', getPasswordResetRequests);

// Reset user password
router.post('/users/:userId/reset-password', resetPassword);

// Xem dữ liệu Redis
router.get('/redis-data', adminController.viewRedisData);

module.exports = router; 