const { Comment, Post, User } = require('../models');

// Create a new comment
exports.createCommentForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userID } = req.body;
  
      // Check if the post exists
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Create the comment
      const comment = await Comment.create({ content, userID, postID: postId });
      res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
      console.error('Error creating comment for post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Get all comments for a post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postID } = req.params;
    const comments = await Comment.findAll({
      where: { postID },
      include: [{ model: User }, { model: Post }],
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a comment
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

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
