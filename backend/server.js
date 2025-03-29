require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
const uploadRoutes = require('./routes/upload');
const productRoutes = require('./routes/productRoutes');  
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Kết nối CSDL trước khi chạy server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Đã kết nối MySQL!');
        
        await sequelize.sync({ alter: true }); // Không xóa dữ liệu cũ
        console.log('✅ CSDL đã đồng bộ!');

        app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
    } catch (error) {
        console.error('❌ Lỗi kết nối CSDL:', error.message);
        process.exit(1);
    }
};

startServer();