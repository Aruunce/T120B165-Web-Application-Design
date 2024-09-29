const { Answer, Comment, User } = require('../models');

// Create a new answer for a comment
exports.createAnswerForComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, userID } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const post = await Post.findByPk(comment.postID);
    if (post.postType !== 'topic') {
      return res.status(400).json({ error: 'Answers can only be added to topic posts.' });
    }

    const answer = await Answer.create({ content, userID, postID: post.postID });
    res.status(201).json({ message: 'Answer created successfully', answer });
  } catch (error) {
    console.error('Error creating answer for comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all answers for a comment
exports.getAnswersByCommentId = async (req, res) => {
  try {
    const { commentId } = req.params;
    const answers = await Answer.findAll({
      where: { commentID: commentId },
      include: [{ model: User }],
    });
    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an answer
exports.updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const answer = await Answer.findByPk(id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    await answer.update({ content });
    res.json({ message: 'Answer updated successfully', answer });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an answer
exports.deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findByPk(id);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    await answer.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
