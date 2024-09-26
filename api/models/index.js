const sequelize = require("../config/database.js");
const bcrypt = require("bcrypt");

const User = require('./User');
const Role = require('./Role');
const Post = require('./Post');
const Comment = require('./Comment');
const LikeRetweet = require('./LikeRetweet');
const Vote = require('./Vote');
const Follow = require('./Follow.js');
const Answer = require('./Answer');

// User & Role
User.belongsTo(Role, { foreignKey: 'roleID' });
Role.hasMany(User, { foreignKey: 'roleID' });

// User & Post
User.hasMany(Post, { foreignKey: 'userID' });
Post.belongsTo(User, { foreignKey: 'userID' });

// Post & Comment
Post.hasMany(Comment, { foreignKey: 'postID' });
Comment.belongsTo(Post, { foreignKey: 'postID' });

// User & Follow (self-referencing many-to-many)
User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingID' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerID' });

// Post & Like/Retweet
Post.hasMany(LikeRetweet, { foreignKey: 'postID' });
LikeRetweet.belongsTo(Post, { foreignKey: 'postID' });
LikeRetweet.belongsTo(User, { foreignKey: 'userID' });

// Post & Answer (for forum posts)
Post.hasMany(Answer, { foreignKey: 'postID' });
Answer.belongsTo(Post, { foreignKey: 'postID' });

// Answer & Vote
Answer.hasMany(Vote, { foreignKey: 'answerID' });
Vote.belongsTo(Answer, { foreignKey: 'answerID' });
Vote.belongsTo(User, { foreignKey: 'userID' });

sequelize
  .sync({ force: true }) // Set force to true to drop tables and recreate them (use with caution)
  .then(async () => {
    console.log("Database synchronized successfully.");
    
    // Create default roles
    await createDefaultRoles();

    // Create default users
    await createDefaultUsers();

    // Create default posts
    await createDefaultPosts();

  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

  async function createDefaultRoles() {
    const rolesToCreate = ['admin', 'user', 'moderator'];
  
    for (const roleName of rolesToCreate) {
      const existingRole = await Role.findOne({ where: { roleName } });
      if (!existingRole) {
        await Role.create({ roleName });
        console.log(`Created Role: ${roleName}`);
      } else {
        console.log(`Role already exists: ${roleName}`);
      }
    }
  }
  
  // Function to create default users
  async function createDefaultUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10); // Example password hash
  
    // Find roles by their names
    const adminRole = await Role.findOne({ where: { roleName: 'admin' } });
    const userRole = await Role.findOne({ where: { roleName: 'user' } });
  
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        roleID: adminRole.id,
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        roleID: userRole.id,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        roleID: userRole.id,
      },
    ];
  
    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created User: ${userData.username}`);
      }
    }
  }
  
  // Function to create default posts
  async function createDefaultPosts() {
    const posts = [
      {
        userID: 1, // Admin
        content: 'Welcome to the forum! This is an idea post.',
        postType: 'idea',
      },
      {
        userID: 2, // John
        content: 'How can I get started with learning Node.js?',
        postType: 'forum',
      },
    ];
  
    for (const postData of posts) {
      await Post.create(postData);
      console.log(`Created Post: ${postData.content}`);
    }
  }

module.exports = {
    User,
    Role,
    Post,
    Comment,
    LikeRetweet,
    Vote,
    Follow,
    Answer,
  };

