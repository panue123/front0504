const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');

// User - Order
User.hasMany(Order);
Order.belongsTo(User);

// Order - OrderItem
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// Product - OrderItem
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Category - Product
Category.hasMany(Product);
Product.belongsTo(Category);

// User - Cart
User.hasOne(Cart);
Cart.belongsTo(User);

// Cart - CartItem
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

// Product - CartItem
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

module.exports = {
    User,
    Product,
    Category,
    Order,
    OrderItem,
    Cart,
    CartItem
};
