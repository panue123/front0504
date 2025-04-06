const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

// Tất cả routes đều cần xác thực
router.use(auth);

// Routes
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.get('/', cartController.getCart);
router.delete('/clear', cartController.clearCart);

module.exports = router; 