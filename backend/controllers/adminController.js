const { redis } = require('../config/redis');

// Xem dữ liệu trong Redis
const viewRedisData = async (req, res) => {
    try {
        // Lấy tất cả keys
        const keys = await redis.keys('*');
        
        // Lấy dữ liệu của từng key
        const data = {};
        for (const key of keys) {
            const type = await redis.type(key);
            
            switch (type) {
                case 'hash':
                    data[key] = await redis.hgetall(key);
                    break;
                case 'string':
                    data[key] = await redis.get(key);
                    break;
                case 'list':
                    data[key] = await redis.lrange(key, 0, -1);
                    break;
                case 'set':
                    data[key] = await redis.smembers(key);
                    break;
                default:
                    data[key] = 'Unsupported type';
            }
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Lỗi khi xem dữ liệu Redis:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xem dữ liệu Redis'
        });
    }
};

module.exports = {
    viewRedisData
}; 