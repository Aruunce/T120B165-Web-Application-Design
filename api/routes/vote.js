const express = require('express');
const voteController = require('../controllers/VoteController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vote
 *   description: API endpoints for voting on posts, comments, and answers.
 */

/**
 * @swagger
 * /posts/{postId}/votes:
 *   post:
 *     summary: Create or update a vote for a post
 *     tags: [Vote]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to vote on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 example: "upvote"
 *     responses:
 *       201:
 *         description: Vote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote created successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     postID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "upvote"
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote updated successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     postID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "upvote"
 *       404:
 *         description: Post not found
 *       400:
 *         description: Must specify either postId or invalid vote type
 *       500:
 *         description: Internal server error
 */
router.post('/posts/:postId/votes', voteController.createOrUpdateVote);

/**
 * @swagger
 * /votes/{voteId}:
 *   delete:
 *     summary: Delete a specific vote
 *     tags: [Vote]
 *     parameters:
 *       - name: voteId
 *         in: path
 *         required: true
 *         description: The ID of the vote to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Vote deleted successfully
 *       404:
 *         description: Vote not found
 *       500:
 *         description: Internal server error
 */
router.delete('/votes/:voteId', voteController.deleteVote);

/**
 * @swagger
 * /posts/{postId}/votes:
 *   get:
 *     summary: Get all votes for a specific post
 *     tags: [Vote]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post for which to retrieve votes
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of votes for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   postID:
 *                     type: integer
 *                     example: 1
 *                   type:
 *                     type: string
 *                     example: "upvote"
 *                   User:
 *                     type: object
 *                     properties:
 *                       userID:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get('/posts/:postId/votes', voteController.getVotesForTarget);

/**
 * @swagger
 * /comments/{commentId}/votes:
 *   post:
 *     summary: Create or update a vote for a comment
 *     tags: [Vote]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment to vote on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 example: "downvote"
 *     responses:
 *       201:
 *         description: Vote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote created successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     commentID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "downvote"
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote updated successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     commentID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "downvote"
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Must specify either commentId or invalid vote type
 *       500:
 *         description: Internal server error
 */
router.post('/comments/:commentId/votes', voteController.createOrUpdateVote);

/**
 * @swagger
 * /comments/{commentId}/votes:
 *   get:
 *     summary: Get all votes for a specific comment
 *     tags: [Vote]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment for which to retrieve votes
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of votes for the specified comment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   commentID:
 *                     type: integer
 *                     example: 1
 *                   type:
 *                     type: string
 *                     example: "downvote"
 *                   User:
 *                     type: object
 *                     properties:
 *                       userID:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/comments/:commentId/votes', voteController.getVotesForTarget);

/**
 * @swagger
 * /answers/{answerId}/votes:
 *   post:
 *     summary: Vote on an answer
 *     tags: [Vote]
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         description: The ID of the answer to vote on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               voteType:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 example: "upvote"
 *     responses:
 *       201:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote recorded successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     answerID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "upvote"
 *       200:
 *         description: Vote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote updated successfully"
 *                 vote:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     answerID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "upvote"
 *       404:
 *         description: Answer not found
 *       400:
 *         description: Must specify either answerId or invalid vote type
 *       500:
 *         description: Internal server error
 */
router.post('/answers/:answerId/votes', voteController.createOrUpdateVote);

/**
 * @swagger
 * /answers/{answerId}/votes:
 *   get:
 *     summary: Get all votes for a specific answer
 *     tags: [Vote]
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         description: The ID of the answer for which to retrieve votes
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of votes for the specified answer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   answerID:
 *                     type: integer
 *                     example: 1
 *                   type:
 *                     type: string
 *                     example: "upvote"
 *                   User:
 *                     type: object
 *                     properties:
 *                       userID:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "alex_smith"
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Internal server error
 */
router.get('/answers/:answerId/votes', voteController.getVotesForTarget);

module.exports = router;
