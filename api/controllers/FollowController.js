const { Follow, User } = require('../models');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { followingID } = req.params;
    const { followerID } = req.body;

    if (followerID === parseInt(followingID, 10)) {
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    const userToFollow = await User.findByPk(followingID);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User to follow not found.' });
    }

    const existingFollow = await Follow.findOne({
      where: {
        followerID,
        followingID,
      },
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'You are already following this user.' });
    }

    const follow = await Follow.create({
      followerID,
      followingID,
    });

    res.status(201).json({ message: 'User followed successfully', follow });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { followingID } = req.params;
    const { followerID } = req.body;

    const follow = await Follow.findOne({
      where: {
        followerID,
        followingID,
      },
    });

    if (!follow) {
      return res.status(404).json({ error: 'You are not following this user.' });
    }

    await follow.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all followers for a user
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await User.findByPk(userId, {
      include: {
        model: User,
        as: 'Followers',
        attributes: ['userID', 'username'],
        through: {
          attributes: [],
        },
      },
    });

    if (!followers) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(followers.Followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users a specific user is following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await User.findByPk(userId, {
      include: {
        model: User,
        as: 'Following',
        attributes: ['userID', 'username'],
        through: {
          attributes: [],
        },
      },
    });

    if (!following) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(following.Following);
  } catch (error) {
    console.error('Error fetching following users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
