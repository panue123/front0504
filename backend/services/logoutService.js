

const revokedTokens = new Set();

class LogoutService {
    static async logout(token) {
        if (token) {
            revokedTokens.add(token); // thêm token vào danh sách bị thu hồi
        }
    }

    static isTokenRevoked(token) {
        return revokedTokens.has(token);
    }
}

module.exports = LogoutService;
