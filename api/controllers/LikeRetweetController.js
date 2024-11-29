const { LikeRetweet, Post, User } = require('../models');

// Like or retweet a post
exports.likeOrRetweetPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, type } = req.body; // Type will be either 'like' or 'retweet'

    // Validate post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Validate type
    if (type !== 'like' && type !== 'retweet') {
      return res.status(400).json({ error: 'Invalid type. Must be "like" or "retweet".' });
    }

    // Check if the user has already liked or retweeted this post
    const existingAction = await LikeRetweet.findOne({
      where: {
        postID: postId,
        userID: userId,
        type: type,
      },
    });

    if (existingAction) {
      return res.status(400).json({ error: `Post already ${type}d.` });
    }

    // Create the like or retweet entry
    const newLikeOrRetweet = await LikeRetweet.create({
      postID: postId,
      userID: userId,
      type: type,
    });

    res.status(201).json({ message: `Post ${type}d successfully`, action: newLikeOrRetweet });
  } catch (error) {
    console.error('Error in liking or retweeting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unlike or unretweet a post
exports.unlikeOrUnretweetPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query; // Accessing userId from query parameters
    const type = req.query.type; // Accessing type from query parameters

    console.log('type:', type);

    // Validate type
    if (type !== 'like' && type !== 'retweet') {
      return res.status(400).json({ error: 'Invalid type. Must be "like" or "retweet".' });
    }

    // Find the like or retweet entry
    const existingAction = await LikeRetweet.findOne({
      where: {
        postID: postId,
        userID: userId,
        type: type,
      },
    });

    if (!existingAction) {
      return res.status(404).json({ error: `Post not found or not ${type}d yet.` });
    }

    // Remove the like or retweet entry
    await existingAction.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in unliking or unretweeting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all likes and retweets for a post
exports.getLikesAndRetweetsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.query.userId;
    
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get all likes and retweets
    const likes = await LikeRetweet.findAll({
      where: { 
        postID: postId,
        type: 'like'
      },
      include: { model: User, attributes: ['userID', 'username'] }
    });

    const retweets = await LikeRetweet.findAll({
      where: { 
        postID: postId,
        type: 'retweet'
      },
      include: { model: User, attributes: ['userID', 'username'] }
    });

    // Check if current user has liked/retweeted
    const parsedUserId = parseInt(userId);
    const userLike = likes.find(action => action.userID === parsedUserId);
    const userRetweet = retweets.find(action => action.userID === parsedUserId);

    res.json({
      likes,
      retweets,
      isLiked: !!userLike,
      isRetweeted: !!userRetweet,
      likeCount: likes.length,
      retweetCount: retweets.length
    });

  } catch (error) {
    console.error('Error fetching likes and retweets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};