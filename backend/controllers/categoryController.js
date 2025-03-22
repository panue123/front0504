const Category = require('../models/Category');
const Product = require('../models/Product');
const { Op } = require('sequelize');

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
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
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }
        category.name = name;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
    }
}

// Xóa danh mục và cập nhật danh mục mới cho từng sản phẩm
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { productCategoryMap } = req.body; // Dữ liệu chứa ID sản phẩm và danh mục mới

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }

        // Lấy danh sách sản phẩm thuộc danh mục này
        const products = await Product.findAll({ where: { category_id: id } });

        // Kiểm tra xem tất cả sản phẩm có được gán danh mục mới không
        for (const product of products) {
            const newCategoryId = productCategoryMap[product.id]; // Lấy danh mục mới cho sản phẩm này

            if (!newCategoryId) {
                return res.status(400).json({ message: `Sản phẩm ${product.name} chưa được gán danh mục mới` });
            }

            // Kiểm tra danh mục mới có tồn tại không
            const newCategory = await Category.findByPk(newCategoryId);
            if (!newCategory) {
                return res.status(400).json({ message: `Danh mục mới cho sản phẩm ${product.name} không hợp lệ` });
            }

            // Cập nhật category_id của sản phẩm
            await product.update({ category_id: newCategoryId });
        }

        // Xóa danh mục sau khi đã cập nhật xong tất cả sản phẩm
        await category.destroy();
        res.json({ message: 'Danh mục đã được xóa và sản phẩm đã được cập nhật danh mục mới' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
    }
};

// Lấy danh sách sản phẩm chưa có trong danh mục
exports.getAvailableProductsForCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy danh sách sản phẩm đã có trong danh mục
        const categoryProducts = await Product.findAll({
            where: { category_id: id },
            attributes: ["id"]
        });

        const existingProductIds = categoryProducts.map(p => p.id); // Lấy danh sách ID sản phẩm đã có trong danh mục

        // Tìm các sản phẩm chưa có trong danh mục này
        const availableProducts = await Product.findAll({
            where: {
                id: { [Op.notIn]: existingProductIds } // Lọc sản phẩm KHÔNG thuộc danh mục
            }
        });

        res.status(200).json(availableProducts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm có thể thêm vào danh mục", error });
    }
};
