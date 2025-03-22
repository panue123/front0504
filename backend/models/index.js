const sequelize = require("../config/db");
const Product = require("./Product");
const Category = require("./Category");

// Thiết lập quan hệ đúng cách
Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });
Category.hasMany(Product, { foreignKey: "category_id" });

module.exports = { sequelize, Product, Category };
