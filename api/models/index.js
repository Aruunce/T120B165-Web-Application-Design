const sequelize = require("../config/database.js");

const User = require('./User');
const Role = require('./Role');
const Post = require('./Post');
const Comment = require('./Comment');
const LikeRetweet = require('./LikeRetweet');
const Vote = require('./Vote');
const Follow = require('./Follow.js');
const Answer = require('./Answer');

// User & Role
User.belongsTo(Role, { foreignKey: 'roleID', as: 'Role' });
Role.hasMany(User, { foreignKey: 'roleID' });

// User & Post
User.hasMany(Post, { foreignKey: 'userID' });
Post.belongsTo(User, { foreignKey: 'userID' });

// Post & Comment
Post.hasMany(Comment, { foreignKey: 'postID' });
Comment.belongsTo(Post, { foreignKey: 'postID' });

// User & Comment (Each comment belongs to a user)
User.hasMany(Comment, { foreignKey: 'userID' });
Comment.belongsTo(User, { foreignKey: 'userID' });

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

// User & LikeRetweet (A user can like or retweet posts)
User.hasMany(LikeRetweet, { foreignKey: 'userID' });
LikeRetweet.belongsTo(User, { foreignKey: 'userID' });

Answer.belongsTo(Post, { foreignKey: 'postID' });
Answer.belongsTo(User, { foreignKey: 'userID' });

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
  
      // Create default comments
      await createDefaultComments();
  
      // Create default answers
      await createDefaultAnswers();
  
      // Create default likes/retweets
      await createDefaultLikesRetweets();
  
      // Create default follows
      await createDefaultFollows();
  
      // Create default votes
      await createDefaultVotes();

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
    const adminRole = await Role.findOne({ where: { roleName: 'admin' } });
    const userRole = await Role.findOne({ where: { roleName: 'user' } });
  
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        roleID: adminRole.roleID, // Use roleID instead of id
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        roleID: userRole.roleID,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        roleID: userRole.roleID,
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Smith',
        roleID: userRole.roleID,
      },
      {
        username: 'user4',
        email: 'user4@example.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Brown',
        roleID: userRole.roleID,
      },
    ];
  
    for (const userData of users) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
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
      {
        userID: 3, // Jane
        content: 'I have an idea about improving the app!',
        postType: 'idea',
      },
      {
        userID: 4, // Emily
        content: 'What are the best practices for API security?',
        postType: 'forum',
      },
      {
        userID: 5, // David
        content: 'Here’s a new idea for improving the user interface.',
        postType: 'idea',
      }
    ];
  
    for (const postData of posts) {
      await Post.create(postData);
      console.log(`Created Post: ${postData.content}`);
    }
  }
  
  async function createDefaultComments() {
    const comments = [
      {
        postID: 2, // John’s post
        userID: 3, // Jane
        content: 'I recommend checking out some tutorials on YouTube!',
      },
      {
        postID: 2, // John’s post
        userID: 4, // Emily
        content: 'You can also try using freeCodeCamp.',
      },
      {
        postID: 4, // Emily’s post
        userID: 2, // John
        content: 'Make sure you use HTTPS and OAuth for API security.',
      }
    ];

    for (const commentData of comments) {
      await Comment.create(commentData);
      console.log(`Created Comment: ${commentData.content}`);
    }
  }


  async function createDefaultAnswers() {
    const answers = [
      {
        postID: 2, // John’s forum post
        userID: 1, // Admin
        content: 'I suggest starting with the official Node.js documentation.',
      },
      {
        postID: 4, // Emily’s forum post
        userID: 5, // David
        content: 'You should look into API keys and rate limiting as well.',
      }
    ];
  
    for (const answerData of answers) {
      // First, check the post type
      const post = await Post.findByPk(answerData.postID);
      
      if (!post) {
        console.error(`Post with ID ${answerData.postID} not found.`);
        continue; // Skip to the next answer
      }
  
      // Only create an answer if the post type is "topic"
      if (post.postType === 'topic') {
        await Answer.create(answerData);
        console.log(`Created Answer: ${answerData.content}`);
      } else {
        console.error(`Cannot create answer for post ID ${answerData.postID} - it is not a topic post.`);
      }
    }
  }

  async function createDefaultLikesRetweets() {
    const likeRetweets = [
      { postID: 1, userID: 2, type: 'like' },
      { postID: 3, userID: 1, type: 'retweet' },
      { postID: 2, userID: 5, type: 'like' },
    ];
  
    for (const likeRetweetData of likeRetweets) {
      await LikeRetweet.create(likeRetweetData);
      console.log(`Created Like/Retweet`);
    }
  }


  async function createDefaultFollows() {
    const follows = [
      { followerID: 2, followingID: 1 }, // John follows Admin
      { followerID: 3, followingID: 2 }, // Jane follows John
      { followerID: 4, followingID: 3 }, // Emily follows Jane
      { followerID: 5, followingID: 4 }, // David follows Emily
    ];
  
    for (const followData of follows) {
      await Follow.create(followData);
      console.log(`Created Follow relationship`);
    }
  }
  
// Function to create default votes
async function createDefaultVotes() {
  const votes = [
    { answerID: 1, userID: 2, type: 'upvote' }, // John votes on Admin's answer (upvote)
    { answerID: 2, userID: 3, type: 'downvote' }, // Jane votes on David's answer (downvote)
  ];

  for (const voteData of votes) {
    try {
      const answer = await Answer.findByPk(voteData.answerID);
      if (!answer) {
        console.log(`Answer with ID ${voteData.answerID} does not exist. Skipping vote creation.`);
        continue;
      }

      const user = await User.findByPk(voteData.userID);
      if (!user) {
        console.log(`User with ID ${voteData.userID} does not exist. Skipping vote creation.`);
        continue;
      }

      await Vote.create(voteData);
      console.log(`Created Vote with type: ${voteData.type} for answer ID: ${voteData.answerID} by user ID: ${voteData.userID}`);
    } catch (error) {
      console.error(`Error creating vote: ${error.message}`);
    }
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

