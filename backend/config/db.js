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

sequelize.authenticate()
    .then(() => {
        console.log('✅ Kết nối MySQL thành công');
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối:', err);
    });

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

module.exports = sequelize ;