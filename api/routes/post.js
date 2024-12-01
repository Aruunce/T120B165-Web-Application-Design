const express = require('express');
const postController = require('../controllers/PostController');
const router = express.Router();
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts.
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a new post."
 *               postType:
 *                 type: string
 *                 example: "idea"  # Could be 'idea' or 'forum'
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.post('/posts', auth, postController.createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.get('/posts', auth, postController.getAllPosts);

/**
 * @swagger
 * /posts/recent:
 *   get:
 *     summary: Get recent posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of recent posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.get('/posts/recent', auth, postController.getRecentPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get('/posts/:id', auth, postController.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content."
 *               postType:
 *                 type: string
 *                 example: "forum"  # or 'idea'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post updated successfully"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put('/posts/:id', auth, postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/posts/:id', auth, postController.deletePost);

/**
 * @swagger
 * /posts/{id}/details:
 *   get:
 *     summary: Get a post with all its details
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post retrieved successfully with all details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postID:
 *                   type: integer
 *                   example: 1
 *                 content:
 *                   type: string
 *                   example: "This is a post"
 *                 postType:
 *                   type: string
 *                   enum: [idea, forum]
 *                   example: "idea"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 User:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                 Comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       commentID:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "This is a comment"
 *                       User:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: "jane_doe"
 *                 LikeRetweets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [like, retweet]
 *                         example: "like"
 *                       User:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: "jane_doe"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get('/posts/:id/details', auth, postController.getPostWithDetails);

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         content:
 *           type: string
 *           example: "This is a new post."
 *         postType:
 *           type: string
 *           example: "idea"
 *         userID:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


module.exports = router;
