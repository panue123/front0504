require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const Redis = require('ioredis');
const { sequelize } = require('./config/db');
const { spawn } = require('child_process');
const path = require('path');
const statisticsRoutes = require('./routes/statisticsRoutes');

// Khởi động Redis server
const startRedisServer = () => {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem Redis đã chạy chưa
        const checkRedis = spawn('redis-cli', ['ping']);
        checkRedis.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Redis server đã chạy');
                resolve();
            } else {
                // Nếu Redis chưa chạy, khởi động nó
                console.log('🔄 Đang khởi động Redis server...');
                const redisServer = spawn('redis-server', [], {
                    stdio: 'inherit',
                    shell: true
                });

                redisServer.on('error', (err) => {
                    console.error('❌ Lỗi khởi động Redis:', err);
                    reject(err);
                });

                // Đợi Redis khởi động
                setTimeout(() => {
                    console.log('✅ Redis server đã khởi động');
                    resolve();
                }, 2000);
            }
        });
    });
};

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
console.log('Cloudinary Config:', process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5000', 'http://127.0.0.1:5500', 'null'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/statistics', statisticsRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Start server
const startServer = async () => {
    try {
        // Khởi động Redis server trước
        await startRedisServer();

        // Sau khi Redis server đã chạy, mới tạo Redis client
        const redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || '',
            retryStrategy: function (times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redis.on('connect', () => {
            console.log('✅ Kết nối Redis thành công');
        });

        redis.on('error', (err) => {
            console.error('❌ Lỗi Redis:', err);
        });

        // Kết nối MySQL
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công');

        // Khởi động server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy trên port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động server:', error);
        process.exit(1);
    }
};

startServer();