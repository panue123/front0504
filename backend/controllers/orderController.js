const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const OrderDetail = require('../models/OrderDetail');

const createOrder = async (req, res) => {
    try {
        const { userId, products, paymentMethod, address, totalMoney } = req.body;

        // Tạo đơn hàng mới
        const order = await Order.create({ userId, paymentMethod, address, totalMoney });

        // Thêm sản phẩm vào OrderDetail
        const orderDetails = await Promise.all(products.map(async (p) => {
            const product = await Product.findByPk(p.productId);
            return {
                orderId: order.id,
                productId: p.productId,
                price: p.price,
                quantity: p.quantity,
                totalPrice: p.price * p.quantity,
                product_name: product ? product.name : 'Sản phẩm đã bị xóa',
                product_image: product ? product.image_url : null
            };
        }));

        await OrderDetail.bulkCreate(orderDetails);
        
        res.json({ message: 'Đơn hàng đã được tạo!', orderId: order.id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
    }
};

// Admin cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, state } = req.body; // Nhận trạng thái từ Admin

        // Kiểm tra trạng thái hợp lệ
        const validStates = ['Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];
        if (!validStates.includes(state)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
        }

        // Tìm đơn hàng cần cập nhật
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
        }

        // Cập nhật trạng thái đơn hàng
        order.state = state;
        if (state === 'Đã hủy') {
            order.cancelOrder = true; // Nếu bị hủy, đánh dấu đơn hàng bị hủy
        }
        await order.save();

        res.status(200).json({ message: 'Cập nhật trạng thái thành công!', order });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng!', error: error.message });
    }
};

//User xem trang thai don hang
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'image_url']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.findAll({
            where: { orderId: req.params.id },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'image_url'],
                required: false
            }]
        });

        const formattedOrderDetails = orderDetails.map(detail => {
            return {
                productId: detail.productId,
                name: detail.Product ? detail.Product.name : detail.product_name,
                image_url: detail.Product ? detail.Product.image_url : detail.product_image,
                price: detail.price,
                quantity: detail.quantity,
                totalPrice: detail.totalPrice
            };
        });

        res.json(formattedOrderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng', error: error.message });
    }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const { products, paymentMethod, address } = req.body;
        const userId = req.user.id;

        // Validate dữ liệu
        if (!products || !Array.isArray(products) || products.length === 0 || !address) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // Tính tổng tiền
        let totalMoney = 0;
        for (const item of products) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ số lượng trong kho!` });
            }
            totalMoney += product.pricediscount * item.quantity;
        }

        // Tạo đơn hàng mới
        const order = await Order.create({
            userId,
            paymentMethod,
            address,
            totalMoney,
            state: 'Chờ xác nhận'
        });

        // Tạo chi tiết đơn hàng
        const orderDetails = await Promise.all(products.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            return {
                orderId: order.id,
                productId: item.productId,
                price: product.pricediscount,
                quantity: item.quantity,
                totalPrice: product.pricediscount * item.quantity
            };
        }));

        await OrderDetail.bulkCreate(orderDetails);

        // Cập nhật số lượng sản phẩm trong kho
        for (const item of products) {
            const product = await Product.findByPk(item.productId);
            await product.update({
                stock: product.stock - item.quantity
            });
        }

        res.status(201).json({
            message: 'Tạo đơn hàng thành công!',
            order
        });
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

// Lấy danh sách đơn hàng của user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'image_url']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

// Lấy chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: {
                id,
                userId
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['id', 'name', 'image_url', 'price', 'pricediscount']
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy đơn hàng!'
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy chi tiết đơn hàng',
            error: error.message
        });
    }
};

// Admin: Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'fullname', 'email', 'phonenumber']
                },
                {
                    model: OrderItem,
                    include: [{
                        model: Product,
                        attributes: ['id', 'name', 'image_url']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy đơn hàng!'
            });
        }

        // Kiểm tra trạng thái hợp lệ
        const validStates = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];
        if (!validStates.includes(state)) {
            return res.status(400).json({
                message: 'Trạng thái không hợp lệ!'
            });
        }

        // Cập nhật trạng thái
        await order.update({ state });

        res.json({
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi cập nhật trạng thái đơn hàng',
            error: error.message
        });
    }
};

// User: Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: {
                id,
                userId
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy đơn hàng!'
            });
        }

        // Chỉ cho phép hủy đơn hàng ở trạng thái "Chờ xác nhận"
        if (order.state !== 'Chờ xác nhận') {
            return res.status(400).json({
                message: 'Không thể hủy đơn hàng ở trạng thái này!'
            });
        }

        // Cập nhật trạng thái đơn hàng
        await order.update({
            state: 'Đã hủy',
            cancelOrder: true
        });

        // Hoàn lại số lượng sản phẩm vào kho
        const orderDetails = await OrderDetail.findAll({
            where: { orderId: id }
        });

        for (const detail of orderDetails) {
            const product = await Product.findByPk(detail.productId);
            await product.update({
                stock: product.stock + detail.quantity
            });
        }

        res.json({
            message: 'Hủy đơn hàng thành công!'
        });
    } catch (error) {
        console.error('Lỗi hủy đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

// Admin: Thống kê doanh thu
exports.getRevenueStats = async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'quarter'
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1); // Mặc định là 1 tháng
        }

        // Lấy doanh thu theo thời gian
        const revenue = await Order.findAll({
            where: {
                state: 'Đã giao',
                createdAt: {
                    [Op.between]: [startDate, now]
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('totalMoney')), 'total']
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });

        // Lấy sản phẩm bán chạy nhất
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']
            ],
            include: [{
                model: Order,
                where: {
                    state: 'Đã giao',
                    createdAt: {
                        [Op.between]: [startDate, now]
                    }
                }
            }],
            group: ['productId'],
            order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
            limit: 5,
            include: [{
                model: Product,
                attributes: ['id', 'name', 'image_url']
            }]
        });

        // Thống kê tổng quan
        const stats = await Promise.all([
            User.count(),
            Product.count(),
            Order.count({
                where: {
                    createdAt: {
                        [Op.between]: [startDate, now]
                    }
                }
            })
        ]);

        res.json({
            revenue,
            topProducts,
            stats: {
                totalUsers: stats[0],
                totalProducts: stats[1],
                totalOrders: stats[2]
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy thống kê',
            error: error.message
        });
    }
};
