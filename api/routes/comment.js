const express = require('express');
const commentController = require('../controllers/CommentController');
const auth = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for managing comments.
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userID
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: "This is a comment"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     commentID:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     User:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request (empty comment)
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 * 
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID to get comments for
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   commentID:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   User:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.post('/posts/:postId/comments', auth, commentController.createCommentForPost);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post for which to retrieve comments
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: No comments found for this post
 *       500:
 *         description: Internal server error
 */
router.get('/posts/:postId/comments', auth, commentController.getCommentsByPostId);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to be updated
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
 *                 example: "Updated comment content."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put('/comments/:id', auth, commentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/comments/:id', auth, commentController.deleteComment);

/**
 * @swagger
 * /comments/{commentID}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     parameters:
 *       - name: commentID
 *         in: path
 *         required: true
 *         description: The ID of the comment to like
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment liked successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post('/comments/:commentID/like', auth, commentController.likeComment);

/**
 * @swagger
 * /comments/{commentID}/upvote:
 *   post:
 *     summary: Upvote a comment
 *     tags: [Comments]
 *     parameters:
 *       - name: commentID
 *         in: path
 *         required: true
 *         description: The ID of the comment to upvote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment upvoted successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post('/comments/:commentID/upvote', auth, commentController.upvoteComment);

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         commentID:
 *           type: integer
 *           example: 1
 *         postID:
 *           type: integer
 *           example: 1
 *         userID:
 *           type: integer
 *           example: 1
 *         content:
 *           type: string
 *           example: "This is a comment."
 *       required:
 *         - commentID
 *         - postID
 *         - userID
 *         - content
 */

module.exports = router;
