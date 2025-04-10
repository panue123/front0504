const logoutService = require('../services/logoutService');

const logout = async (req, res, next) => {
    try {
        const token = req.token; // lấy từ middleware
        await logoutService.logout(token);
        res.json({ message: 'Đăng xuất thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports = { logout };