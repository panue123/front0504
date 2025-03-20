require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes);

const productRoutes = require('./routes/productRoutes');  
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

// Kết nối CSDL trước khi chạy server
const startServer = async () => {
    try {
        await sequelize.sync({ force: false }); // Không xóa dữ liệu cũ
        console.log('✅ CSDL đã đồng bộ!');
        app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
    } catch (error) {
        console.error('❌ Lỗi kết nối CSDL:', error.message);
    }
};

startServer();
