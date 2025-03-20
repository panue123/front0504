const UserOrderMap = require('../models/UserOrderMap');

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
