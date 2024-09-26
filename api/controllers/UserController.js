const { Users, Roles, Posts } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({
      where: { username },
      include: [{ model: Roles, as: 'Role', attributes: ['roleName'] }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const userData = {
      id: user.userID,
      username: user.username,
      role: user.Role.roleName,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, role } = req.body;

    // Check if the username or email already exists
    const existingUser = await Users.findOne({
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

    // Get role ID
    let roleID = 1; // Default role ID for 'user'
    if (role) {
      const foundRole = await Roles.findOne({ where: { roleName: role } });
      if (foundRole) {
        roleID = foundRole.roleID;
      }
    }

    // Create the new user
    const newUser = await Users.create({
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
    const user = await Users.findByPk(req.user.id, {
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
    const users = await Users.findAll();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: Check if the user trying to delete is an admin or the user themself
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

    // Find the user
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the posts for the user
    const posts = await Posts.findAll({ where: { userID: id } });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};