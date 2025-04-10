const { Order, OrderDetail, Product, Category, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Thống kê tổng quan
exports.getOverview = async (req, res) => {
    try {
        const [
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers
        ] = await Promise.all([
            Order.count(),
            Order.sum('total'),
            Product.count(),
            User.count()
        ]);

        res.json({
            totalOrders,
            totalRevenue: totalRevenue || 0,
            totalProducts,
            totalUsers
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê tổng quan:', error);
        res.status(500).json({
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

// Thống kê doanh thu theo tháng
exports.getRevenue = async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        
        const monthlyRevenue = await Order.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
            ],
            where: sequelize.where(
                sequelize.fn('YEAR', sequelize.col('createdAt')),
                year
            ),
            group: [sequelize.fn('MONTH', sequelize.col('createdAt'))]
        });

        res.json(monthlyRevenue);
    } catch (error) {
        console.error('Lỗi khi lấy thống kê doanh thu:', error);
        res.status(500).json({
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

// Thống kê đơn hàng
exports.getOrders = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const where = {};
        
        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const orders = await Order.findAll({
            where,
            include: [{
                model: OrderDetail,
                include: [Product]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy thống kê đơn hàng:', error);
        res.status(500).json({
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

// Thống kê sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                attributes: ['name']
            }],
            order: [['sold', 'DESC']]
        });

        res.json(products);
    } catch (error) {
        console.error('Lỗi khi lấy thống kê sản phẩm:', error);
        res.status(500).json({
            message: 'Lỗi server!',
            error: error.message
        });
    }
};

// Lấy thống kê chung
exports.getGeneralStatistics = async (req, res) => {
    try {
        res.json({
            message: 'Chức năng đang được phát triển'
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê chung:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Lấy thống kê theo thời gian
exports.getTimeStatistics = async (req, res) => {
    try {
        res.json({
            message: 'Chức năng đang được phát triển'
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê theo thời gian:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Lấy thống kê theo danh mục
exports.getCategoryStatistics = async (req, res) => {
    try {
        res.json({
            message: 'Chức năng đang được phát triển'
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê theo danh mục:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
};

// Lấy thống kê theo sản phẩm
exports.getProductStatistics = async (req, res) => {
    try {
        res.json({
            message: 'Chức năng đang được phát triển'
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê theo sản phẩm:', error);
        res.status(500).json({
            message: 'Lỗi server!'
        });
    }
}; 