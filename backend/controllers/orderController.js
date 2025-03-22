const UserOrderMap = require('../models/UserOrderMap');

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
        const order = await UserOrderMap.findByPk(orderId);
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
        const { userId } = req.params; // Lấy ID của User

        const orders = await UserOrderMap.findAll({ where: { userId } });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng!', error: error.message });
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
