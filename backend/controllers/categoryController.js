const Category = require('../models/Category');
const Product = require('../models/Product');
const { Op } = require('sequelize');

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { description } = req.body;
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm danh mục', error });
    }
}

// Xem tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error });
    }
}

// Xem sản phẩm trong một danh mục
exports.getProductsInCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, {
            include: Product
        });
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }
        res.status(200).json(category.Products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm trong danh mục', error });
    }
}   

// Sửa tên danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { description } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }
        category.name = name;
        category.description = description;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
    }
}

// Xóa danh mục và cập nhật cho từng sản phẩm là chưa có danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { productCategoryMap } = req.body; // Dữ liệu chứa ID sản phẩm và danh mục mới

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }
        // Xóa danh mục sau khi đã cập nhật xong tất cả sản phẩm
        await category.destroy();
        res.json({ message: 'Danh mục đã được xóa và sản phẩm đã được cập nhật danh mục mới' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
    }
};