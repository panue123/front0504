const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'image_url', 'name', 'price', 'pricediscount', 'stock', 'category_id', 'description'],
            where: { is_deleted: false } // Lọc sản phẩm chưa bị ẩn
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm', error });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        console.log("📸 File nhận được:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng upload ảnh!' });
        }
        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { 
            folder: 'products',
            transformation: { width: 500, height: 500, crop: 'fill' }
        });

        // Lấy dữ liệu từ request body
        const { name, price, pricediscount, stock, description, category_id } = req.body;
        if (!name || !price || !stock || !category_id) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sản phẩm!' });
        }
        
        // Kiểm tra category_id có tồn tại không
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ message: 'Danh mục không hợp lệ!' });
        }

        // Lưu sản phẩm vào database
        const newProduct = await Product.create({
            name,            
            description,
            category_id,
            stock,
            price,
            pricediscount: pricediscount || 0,            
            image_url: result.secure_url, // Lưu link ảnh vào database
        });

        res.status(201).json({ message: 'Thêm sản phẩm thành công!', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm sản phẩm', error: error.message });
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
        const { name, price, pricediscount, description, stock, category_id } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        let newImageUrl = product.image_url;
        if (req.file) {
            // Xóa ảnh cũ trên Cloudinary nếu có
            if (product.image_url) {
                const publicId = product.image_url.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
            }

            // Upload ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'products' });
            newImageUrl = result.secure_url;
        }

        // Cập nhật thông tin sản phẩm trong database
        await product.update({ name, price, pricediscount, description, stock, category_id, image_url: newImageUrl });

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

        // Đánh dấu sản phẩm là đã bị xóa
        await product.update({ is_deleted: true });

        res.json({ message: 'Sản phẩm đã được ẩn (is_deleted = true)' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi ẩn sản phẩm', error: error.message });
    }
};

// Khôi phục sản phẩm
exports.restoreProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        await product.update({ is_deleted: false });

        res.json({ message: 'Sản phẩm đã được khôi phục!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi khôi phục sản phẩm', error: error.message });
    }
};