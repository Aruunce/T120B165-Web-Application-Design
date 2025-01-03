const { User, Role, Post, LikeRetweet } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const userData = {
      id: user.userID,
      username: user.username,
      role: user.Role.roleName,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already taken' });
    }

    let roleID = 2;
    if (role) {
      const foundRole = await Role.findOne({ where: { roleName: role } });
      if (foundRole) {
        roleID = foundRole.roleID;
      }
    }

    const newUser = await User.create({
      username,
      password,
      email,
      firstName,
      lastName,
      roleID
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userID: newUser.userID,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roleID: newUser.roleID
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['userID', 'username', 'email', 'firstName', 'lastName']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }]
    });


    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user.id !== user.userID) {
      return res.status(403).json({ error: 'Unauthorized to delete this user' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.findAll({ where: { userID: id } });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    if (role) {
      const foundRole = await Role.findOne({ where: { roleName: role } });
      if (foundRole) {
        user.roleID = foundRole.roleID;
      }
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        userID: user.userID,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleID: user.roleID
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Method to get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['userID', 'username', 'email', 'firstName', 'lastName']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserPostsAndLikes = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findByPk(userID, {
      include: [{
        model: Post,
        include: [{
          model: LikeRetweet,
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user posts and likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getUserPostsAndLikesByID = async (req, res) => {
  try {
    const { userID, postID } = req.params;

    const user = await User.findByPk(userID, {
      include: [{
        model: Post,
        where: postID ? { id: postID } : {},
        include: [{
          model: LikeRetweet,
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user posts and likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getUserPostsAndLikesByID = async (req, res) => {
  try {
    const { userID, postID } = req.params; // Extract userID and postID from request params

    // Fetch the user by their userID
    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.findAll({
      where: {
        userId: userID,
        ...(postID && { postID: postID }),
      },
      include: [{
        model: LikeRetweet,
      }]
    });

    if (postID && posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      user,
      posts,
    });
  } catch (error) {
    console.error('Error fetching user posts and likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

