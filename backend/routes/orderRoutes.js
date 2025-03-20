const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// API Admin cập nhật trạng thái đơn hàng
router.put('/update-status', orderController.updateOrderStatus);

// API User xem trạng thái đơn hàng của họ
router.get('/user/:userId', orderController.getUserOrders);

module.exports = router;
