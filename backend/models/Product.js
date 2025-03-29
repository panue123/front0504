const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");  // 🔥 Đảm bảo import đúng

const Product = sequelize.define(
    "Product",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        category_id: { type: DataTypes.INTEGER, allowNull: false },
        image_url: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        pricediscount: { type: DataTypes.FLOAT, defaultValue: 0 },
        description: { type: DataTypes.TEXT },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 },
        is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
        tableName: "Product",
        timestamps: true,
    }
);

if (Category) {
    Product.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });
} else {
    console.error("🚨 LỖI: Model Category chưa được khởi tạo đúng!");
}

module.exports = Product;
