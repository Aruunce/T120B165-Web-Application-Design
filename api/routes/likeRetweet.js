const express = require('express');
const likeRetweetController = require('../controllers/LikeRetweetController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: LikeRetweet
 *   description: API endpoints for liking and retweeting posts.
 */

/**
 * @swagger
 * /posts/{postId}/like-retweet:
 *   post:
 *     summary: Like or retweet a specific post
 *     tags: [LikeRetweet]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to like or retweet
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
 *                 enum: [like, retweet]
 *                 example: "like"
 *     responses:
 *       201:
 *         description: Post liked or retweeted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post liked successfully"
 *                 action:
 *                   type: object
 *                   properties:
 *                     postID:
 *                       type: integer
 *                       example: 1
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "like"
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid type or post already liked/retweeted
 *       500:
 *         description: Internal server error
 */
router.post('/posts/:postId/like-retweet', likeRetweetController.likeOrRetweetPost);

/**
 * @swagger
 * /posts/{postId}/like-retweet:
 *   delete:
 *     summary: Unlike or unretweet a post
 *     tags: [LikeRetweet]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to unlike or unretweet
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: query
 *         required: true
 *         description: The ID of the user performing the action
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         required: true
 *         description: The type of action to perform, either 'like' or 'retweet'
 *         schema:
 *           type: string
 *           enum: [like, retweet]
 *     responses:
 *       204:
 *         description: Successfully removed like or retweet
 *       400:
 *         description: Invalid type or other client error
 *       404:
 *         description: Post not found or not liked/retweeted
 *       500:
 *         description: Internal server error
 */
router.delete('/posts/:postId/like-retweet', likeRetweetController.unlikeOrUnretweetPost);

/**
 * @swagger
 * /posts/{postId}/like-retweet:
 *   get:
 *     summary: Get all likes and retweets for a specific post
 *     tags: [LikeRetweet]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post for which to retrieve likes and retweets
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of likes and retweets for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: integer
 *                     example: 1
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   type:
 *                     type: string
 *                     example: "like"
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
router.get('/posts/:postId/like-retweet', likeRetweetController.getLikesAndRetweetsForPost);

module.exports = router;
