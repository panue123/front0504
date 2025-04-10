const Redis = require('ioredis');
require('dotenv').config();

// Tạo Redis client
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

// Prefix cho các key trong Redis
const PREFIX = {
    CART: 'cart:',
    PRODUCT: 'product:',
    CATEGORY: 'category:',
    USER: 'user:'
};

// Thời gian cache (giây)
const CACHE_TTL = {
    CART: 24 * 60 * 60, // 24 giờ
    PRODUCT: 60 * 60, // 1 giờ
    CATEGORY: 60 * 60, // 1 giờ
    USER: 30 * 60 // 30 phút
};

// Hàm lấy dữ liệu từ cache
const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

// Hàm lưu dữ liệu vào cache
const setCache = async (key, data, ttl) => {
    try {
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
        return true;
    } catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
};

// Hàm xóa dữ liệu khỏi cache
const deleteCache = async (key) => {
    try {
        await redis.del(key);
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
};

// Hàm lấy giỏ hàng từ cache
const getCart = async (userId) => {
    return getCache(`${PREFIX.CART}${userId}`);
};

// Hàm lưu giỏ hàng vào cache
const setCart = async (userId, cartData) => {
    return setCache(`${PREFIX.CART}${userId}`, cartData, CACHE_TTL.CART);
};

// Hàm xóa giỏ hàng khỏi cache
const deleteCart = async (userId) => {
    return deleteCache(`${PREFIX.CART}${userId}`);
};

// Hàm lấy thông tin sản phẩm từ cache
const getProduct = async (productId) => {
    return getCache(`${PREFIX.PRODUCT}${productId}`);
};

// Hàm lưu thông tin sản phẩm vào cache
const setProduct = async (productId, productData) => {
    return setCache(`${PREFIX.PRODUCT}${productId}`, productData, CACHE_TTL.PRODUCT);
};

// Hàm xóa thông tin sản phẩm khỏi cache
const deleteProduct = async (productId) => {
    return deleteCache(`${PREFIX.PRODUCT}${productId}`);
};

// Hàm lấy danh sách sản phẩm theo danh mục từ cache
const getProductsByCategory = async (categoryId) => {
    return getCache(`${PREFIX.PRODUCT}category:${categoryId}`);
};

// Hàm lưu danh sách sản phẩm theo danh mục vào cache
const setProductsByCategory = async (categoryId, products) => {
    return setCache(`${PREFIX.PRODUCT}category:${categoryId}`, products, CACHE_TTL.PRODUCT);
};

// Hàm xóa cache của tất cả sản phẩm trong danh mục
const deleteProductsByCategory = async (categoryId) => {
    return deleteCache(`${PREFIX.PRODUCT}category:${categoryId}`);
};

module.exports = {
    redis,
    getCart,
    setCart,
    deleteCart,
    getProduct,
    setProduct,
    deleteProduct,
    getProductsByCategory,
    setProductsByCategory,
    deleteProductsByCategory
}; 