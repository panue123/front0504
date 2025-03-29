const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Middleware xử lý ảnh
const productController = require('../controllers/productController');

// Middleware kiểm tra ID hợp lệ
const checkIdParam = (req, res, next) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    next();
};

// Routes quản lý sản phẩm
router.post('/', upload.single('image'), productController.createProduct); // Thêm sản phẩm (có upload ảnh)
router.get('/', productController.getAllProducts); // Lấy danh sách sản phẩm
router.get('/:id', checkIdParam, productController.getProductById); // Lấy chi tiết sản phẩm
router.put('/:id', checkIdParam, upload.single('image'), productController.updateProduct); // Cập nhật sản phẩm
router.delete('/:id', checkIdParam, productController.deleteProduct); // Xóa sản phẩm

module.exports = router;