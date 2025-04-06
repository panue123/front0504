const verifyToken = require('./jwt');

const checkAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này!' });
        }
        next();
    });
};

module.exports = checkAuth; 