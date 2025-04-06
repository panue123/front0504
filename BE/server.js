const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db.js");
const authRoutes = require('./routes/auth.routes');

const app = express();

// Cấu hình CORS để cho phép origin cụ thể với FE
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204, // Trả về 204 No Content cho các request OPTIONS
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

app.get('/api/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công từ server.js!');

    await sequelize.sync();
    console.log('Đồng bộ cơ sở dữ liệu thành công từ server.js!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi trong startServer (server.js):', error);
  }
}

//startServer();