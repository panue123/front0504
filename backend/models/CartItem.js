const { DataTypes } = require('sequelize');
const db = require('../config/db');

const CartItem = db.sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'carts',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'cart_items',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
    deletedAt: 'deleted_at'
});

module.exports = CartItem; 