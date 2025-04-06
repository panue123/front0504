require("dotenv").config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect: process.env.DB_DIALECT || 'mysql', // Đảm bảo dialect được cung cấp
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log("Database connected from db.js"))
  .catch((err) => console.error("Database connection error from db.js:", err));

module.exports = sequelize;