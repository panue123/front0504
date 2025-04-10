const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { isAdmin } = require('../middlewares/isAdmin');

// Áp dụng middleware isAdmin cho tất cả routes
router.use(isAdmin);

// Lấy thống kê chung
router.get('/', statisticsController.getGeneralStatistics);

// Lấy thống kê theo thời gian
router.get('/time', statisticsController.getTimeStatistics);

// Lấy thống kê theo danh mục
router.get('/categories', statisticsController.getCategoryStatistics);

// Lấy thống kê theo sản phẩm
router.get('/products', statisticsController.getProductStatistics);

module.exports = router; 