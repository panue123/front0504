const {DataTypes} = require("sequelize")
const sequelize = require("../config/db.js")
const User = sequelize.define(
    "User", {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
       },
        username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
       },
        fullname:{
        type: DataTypes.STRING,
        allowNull: false,
       },
        email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
       },
        password: {
        type: DataTypes.STRING,
        allowNull: false,
       },
        role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
       },
        img: {
        type: DataTypes.STRING, // Lưu đường dẫn ảnh (URL)
        allowNull: true,
      },
        phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, 
    {
        tableName: "users",
        timestamps: true, 
      }
);
module.exports = User;