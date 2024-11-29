const { Vote, User, Post, Comment, Answer } = require('../models');
const { validationResult } = require('express-validator');

// Create or Update a Vote for Posts and Comments
exports.createOrUpdateVote = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, type } = req.body;

    if (!commentId || !userId || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: commentId, userId, or type' 
      });
    }

    if (!['upvote', 'downvote'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid vote type. Must be "upvote" or "downvote"' 
      });
    }

    // Find the comment
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already voted on this comment
    const existingVote = await Vote.findOne({
      where: {
        commentID: commentId,
        userID: userId
      }
    });

    let voteResult;
    let message;
    
    if (existingVote) {
      // If clicking the same vote type, remove the vote (unvoting)
      if (existingVote.type === type) {
        await existingVote.destroy();
        message = 'Vote removed';
        voteResult = { action: 'removed', type };
      } else {
        // If clicking different vote type, update the vote
        await existingVote.update({ type });
        message = 'Vote updated';
        voteResult = { action: 'updated', type };
      }
    } else {
      // Create new vote if none exists
      await Vote.create({
        commentID: commentId,
        userID: userId,
        type
      });
      message = 'Vote created';
      voteResult = { action: 'created', type };
    }

    // Get updated vote counts
    const upvotes = await Vote.count({
      where: {
        commentID: commentId,
        type: 'upvote'
      }
    });

    const downvotes = await Vote.count({
      where: {
        commentID: commentId,
        type: 'downvote'
      }
    });

    // Get user's current vote status
    const currentVote = await Vote.findOne({
      where: {
        commentID: commentId,
        userID: userId
      }
    });

    res.json({
      message,
      voteResult,
      upvotes,
      downvotes,
      userVote: currentVote ? currentVote.type : null
    });

  } catch (error) {
    console.error('Error handling vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Vote
exports.deleteVote = async (req, res) => {
  try {
    const { voteId } = req.params;

    const vote = await Vote.findByPk(voteId);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    await vote.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all votes for a post or comment
exports.getVotesForTarget = async (req, res) => {
  try {
    const { postId, commentId } = req.params; // Get postId or commentId from params
    let targetId;

    if (postId) {
      targetId = postId;
    } else if (commentId) {
      targetId = commentId;
    } else {
      return res.status(400).json({ error: 'Must specify either postId or commentId' });
    }

    const votes = await Vote.findAll({
      where: {
        postID: postId || null,
        commentID: commentId || null,
      },
      include: [{ model: User }],
    });

    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Vote on an Answer
exports.voteOnAnswer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { answerId } = req.params;
    const { userId, voteType } = req.body;

    // Check if the answer exists
    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Prevent a user from voting twice on the same answer
    const existingVote = await Vote.findOne({ where: { answerID: answerId, userID: userId } });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this answer.' });
    }

    const vote = await Vote.create({ answerID: answerId, userID: userId, type: voteType });
    res.status(201).json({ message: 'Vote recorded successfully', vote });
  } catch (error) {
    console.error('Error voting on answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};