const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../utils/errors');
const User = require('../models/User');

class LoginService {
    static async login(username, password) {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedError('Tài khoản không tồn tại!');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Mật khẩu không đúng!');
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                fullname: user.fullname
            },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '1d' }
        );

        return { token };
    }
}

module.exports = LoginService;
