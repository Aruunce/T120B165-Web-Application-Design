const express = require('express');
const followController = require('../controllers/FollowController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: API endpoints for managing user follow relationships.
 */

/**
 * @swagger
 * /users/{followingID}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Follows]
 *     parameters:
 *       - name: followingID
 *         in: path
 *         required: true
 *         description: The ID of the user to be followed
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followerID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User followed successfully"
 *                 follow:
 *                   $ref: '#/components/schemas/Follow'
 *       400:
 *         description: Error following user (e.g., self-follow, already following)
 *       404:
 *         description: User to follow not found
 *       500:
 *         description: Internal server error
 */
router.post('/users/:followingID/follow', followController.followUser);

/**
 * @swagger
 * /users/{followingID}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follows]
 *     parameters:
 *       - name: followingID
 *         in: path
 *         required: true
 *         description: The ID of the user to be unfollowed
 *         schema:
 *           type: integer
 *       - name: followerID
 *         in: query
 *         required: true
 *         description: The ID of the follower
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User unfollowed successfully
 *       404:
 *         description: You are not following this user
 *       500:
 *         description: Internal server error
 */
router.delete('/users/:followingID/unfollow', followController.unfollowUser);

/**
 * @swagger
 * /users/{userId}/followers:
 *   get:
 *     summary: Get all followers for a user
 *     tags: [Follows]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to get followers for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of followers for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/:userId/followers', followController.getFollowers);

/**
 * @swagger
 * /users/{userId}/following:
 *   get:
 *     summary: Get all users a specific user is following
 *     tags: [Follows]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to get following for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users that the specified user is following
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/:userId/following', followController.getFollowing);

/**
 * @swagger
 * components:
 *   schemas:
 *     Follow:
 *       type: object
 *       properties:
 *         followerID:
 *           type: integer
 *           example: 1
 *         followingID:
 *           type: integer
 *           example: 2
 *     User:
 *       type: object
 *       properties:
 *         userID:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "john_doe"
 */

module.exports = router;