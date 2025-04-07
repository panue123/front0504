const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
const uploadRoutes = require('./routes/upload');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const Redis = require('ioredis');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const startRedisServer = () => {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem Redis đã chạy chưa
        const checkRedis = spawn('redis-cli', ['ping']);
        checkRedis.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Redis server đã chạy');
                resolve();
            } else {
                reject(new Error('❌ Redis server không chạy!'));
            }
        });
    });
};

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
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy trên port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động server:', error.message);
        process.exit(1);
    }
};

startServer();
