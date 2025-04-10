require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Thêm CORS để frontend có thể gọi API
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);


app.use((err, req, res, next) => {
  console.error('[Middleware Error]', err);
  res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Lỗi server!'
  });
});

const checkDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối DB thành công')
        
        await sequelize.sync();
        console.log('✅ Sync DB thành công');
        
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối DB:', error);
        return false;
    }
};

// Khởi động server sau khi kiểm tra DB
checkDB().then(isConnected => {
    if (isConnected) {
        app.listen(5000, () => 
            console.log('🚀 Server running on port 5000')
        );
    } else {
        console.error('❌ Không thể khởi động server do lỗi DB');
        process.exit(1);
    }
});