const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Middleware kiểm tra ID hợp lệ
const checkIdParam = (req, res, next) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    next();
};

// Routes quản lý danh mục
router.post('/', categoryController.createCategory); // Thêm danh mục
router.get('/', categoryController.getAllCategories); // Lấy danh sách danh mục
router.get('/:id/products', categoryController.getProductsInCategory); // Lấy sản phẩm trong danh mục
router.put('/:id', categoryController.updateCategory); // Cập nhật danh mục
router.delete('/:id', categoryController.deleteCategory); // Xóa danh mục
router.get("/api/categories/:id/available-products", categoryController.getAvailableProductsForCategory); // Lấy sản phẩm chưa có trong danh mục

module.exports = router;