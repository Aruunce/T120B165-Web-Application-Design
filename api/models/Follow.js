const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  followID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  followerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  followingID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'follows',
});

module.exports = Follow;
