const { getCart, setCart, deleteCart, getProduct } = require('../utils/redis');
const { Product } = require('../models');
const { logger } = require('../utils/logger');
const { redis } = require('../config/redis');

// Lấy giỏ hàng của người dùng
const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Lấy giỏ hàng từ cache
        let cart = await getCart(userId);
        
        // Nếu không có trong cache, trả về giỏ hàng rỗng
        if (!cart) {
            cart = {
                items: [],
                total: 0
            };
            await setCart(userId, cart);
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        logger.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy giỏ hàng'
        });
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId, quantity = 1 } = req.body;

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại'
            });
        }

        // Lấy giỏ hàng hiện tại
        const cartKey = `cart:${userId}`;
        const currentCart = await redis.hgetall(cartKey);

        // Thêm sản phẩm vào giỏ
        await redis.hset(cartKey, productId, JSON.stringify({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        }));

        res.json({
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi thêm vào giỏ hàng'
        });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId, quantity } = req.body;

        const cartKey = `cart:${userId}`;
        const product = await redis.hget(cartKey, productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại trong giỏ hàng'
            });
        }

        const productData = JSON.parse(product);
        productData.quantity = quantity;

        await redis.hset(cartKey, productId, JSON.stringify(productData));

        res.json({
            success: true,
            message: 'Cập nhật giỏ hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật giỏ hàng'
        });
    }
};

// Xóa sản phẩm khỏi giỏ
const removeFromCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId } = req.params;

        const cartKey = `cart:${userId}`;
        const product = await redis.hget(cartKey, productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Sản phẩm không tồn tại trong giỏ hàng'
            });
        }

        await redis.hdel(cartKey, productId);

        res.json({
            success: true,
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa khỏi giỏ hàng'
        });
    }
};

// Lấy giỏ hàng
const getCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const cartKey = `cart:${userId}`;
        const cart = await redis.hgetall(cartKey);

        // Chuyển đổi dữ liệu từ Redis sang mảng
        const cartItems = Object.values(cart).map(item => JSON.parse(item));

        // Tính tổng tiền
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                total
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy giỏ hàng'
        });
    }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const cartKey = `cart:${userId}`;
        await redis.del(cartKey);

        res.json({
            success: true,
            message: 'Xóa giỏ hàng thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa giỏ hàng'
        });
    }
};

module.exports = {
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    clearCart
}; 