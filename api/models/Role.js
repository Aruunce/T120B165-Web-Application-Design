const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Roles', {
  roleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false,
  freezeTableName: true,
});

module.exports = Role;
