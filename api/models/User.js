// models/Users.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

const User = sequelize.define(
  "Users",
  {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    registerDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;
