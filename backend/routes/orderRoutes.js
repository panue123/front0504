const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/jwt');
const adminMiddleware = require('../middlewares/admin');

// Routes không cần xác thực
router.post('/', verifyToken, orderController.createOrder);

// Routes cần xác thực user
router.get('/user', verifyToken, orderController.getUserOrders);
router.get('/user/:id', verifyToken, orderController.getOrderById);
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// Routes cần quyền admin
router.get('/', verifyToken, adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', verifyToken, adminMiddleware, orderController.updateOrderStatus);
router.get('/stats/revenue', verifyToken, adminMiddleware, orderController.getRevenueStats);

module.exports = router;
