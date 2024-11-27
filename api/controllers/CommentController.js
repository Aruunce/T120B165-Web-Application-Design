const { Comment, Post, User } = require('../models');

  // Create a new comment
  exports.createCommentForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userID } = req.body;
  
      // Input validation
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Comment content cannot be empty' });
      }
  
      // Find post with user information
      const post = await Post.findOne({
        where: { postID: postId },
        include: [{ model: User }]
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const comment = await Comment.create({
        content: content.trim(),
        userID,
        postID: postId
      });
  
      // Fetch the created comment with user information
      const commentWithUser = await Comment.findOne({
        where: { commentID: comment.commentID },
        include: [{ model: User, attributes: ['username'] }]
      });
  
      res.status(201).json({
        message: 'Comment created successfully',
        comment: commentWithUser
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getCommentsByPostId = async (req, res) => {
    try {
      const { postId } = req.params;
      
      const comments = await Comment.findAll({
        where: { postID: postId },
        include: [{ 
          model: User,
          attributes: ['username'] 
        }],
        order: [['createdAt', 'DESC']]
      });
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.update({ content });
    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.upvoteComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = await Comment.findByPk(commentID);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.upvotes = (comment.upvotes || 0) + 1;
    await comment.save();

    res.json({ message: 'Comment upvoted successfully', comment });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = await Comment.findByPk(commentID);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.likes = (comment.likes || 0) + 1;
    await comment.save();

    res.json({ message: 'Comment liked successfully', comment });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};