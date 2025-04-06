const { Sequelize } = require('sequelize');
require('dotenv').config();

// Kết nối MySQL với connection pool
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Tắt log SQL queries
        pool: {
            max: 5,        // Số lượng kết nối tối đa
            min: 0,        // Số lượng kết nối tối thiểu
            acquire: 30000, // Thời gian tối đa để lấy kết nối (ms)
            idle: 10000    // Thời gian tối đa một kết nối có thể idle (ms)
        }
    }
);

// Hàm kết nối với retry logic
const connectWithRetry = async (retries = 5) => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công');
        return true;
    } catch (err) {
        console.error('❌ Lỗi kết nối:', err);
        if (retries > 0) {
            console.log(`Thử kết nối lại sau 5 giây... (${retries} lần còn lại)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectWithRetry(retries - 1);
        }
        throw err;
    }
};

// Xử lý đóng kết nối khi tắt server
process.on('SIGINT', async () => {
    try {
        await sequelize.close();
        console.log('Đóng kết nối database thành công');
        process.exit(0);
    } catch (err) {
        console.error('Lỗi khi đóng kết nối:', err);
        process.exit(1);
    }
});

module.exports = { sequelize, connectWithRetry };