const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'image_url', 'name', 'price', 'stock', 'category_id']
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm', error });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        console.log("📸 File nhận được:", req.file); // Kiểm tra ảnh có được gửi không

        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng upload ảnh!' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'products' });

        res.json({ message: 'Upload thành công!', url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi upload ảnh', error: error.message });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy sản phẩm', error: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category_id } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        let newImageUrl = product.image_url;
        if (req.file) {
            // Xóa ảnh cũ trên Cloudinary nếu có
            const publicId = product.image_url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);

            // Upload ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'products' });
            newImageUrl = result.secure_url;
        }

        await product.update({ name, price, description, stock, category_id, image_url: newImageUrl });
        res.json({ message: 'Cập nhật sản phẩm thành công', product });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật sản phẩm', error: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        // Xóa ảnh trên Cloudinary
        const publicId = product.image_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);

        await product.destroy();
        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa sản phẩm', error: error.message });
    }
};
