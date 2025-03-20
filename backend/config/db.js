const { Sequelize } = require('sequelize');

// Kết nối MySQL
const sequelize = new Sequelize('admin_panel', 'root', '040904', {
    host: 'localhost',
    dialect: 'mysql'
});

// Kiểm tra kết nối
sequelize.authenticate()
    .then(() => console.log('✅ Kết nối MySQL thành công'))
    .catch(err => console.error('❌ Lỗi kết nối:', err));

module.exports = sequelize;
