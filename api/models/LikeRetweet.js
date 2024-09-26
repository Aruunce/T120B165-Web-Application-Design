const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeRetweet = sequelize.define('LikeRetweet', {
  likeRetweetID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  postID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('like', 'retweet'),
    allowNull: false,
  },
}, {
  tableName: 'like_retweets',
});

module.exports = LikeRetweet;