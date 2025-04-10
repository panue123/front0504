const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Cart = db.sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'carts',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    paranoid: true,
    deletedAt: 'deleted_at'
});

module.exports = Cart; 