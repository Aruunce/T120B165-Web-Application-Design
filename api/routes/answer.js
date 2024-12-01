const express = require('express');
const answerController = require('../controllers/AnswerController');
const router = express.Router();
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: API endpoints for managing answers to comments.
 */

/**
 * @swagger
 * /comments/{commentId}/answers:
 *   post:
 *     summary: Create a new answer for a specific comment
 *     tags: [Answers]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment to which the answer will be added
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
 *                 example: "This is an answer."
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answer created successfully"
 *                 answer:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "This is an answer."
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     postID:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Answers can only be added to topic posts
 *       500:
 *         description: Internal server error
 */
router.post('/comments/:commentId/answers', auth, answerController.createAnswerForComment);

/**
 * @swagger
 * /comments/{commentId}/answers:
 *   get:
 *     summary: Get all answers for a specific comment
 *     tags: [Answers]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment for which to retrieve answers
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of answers for the specified comment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "This is an answer."
 *                   userID:
 *                     type: integer
 *                     example: 1
 *                   postID:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/comments/:commentId/answers', auth, answerController.getAnswersByCommentId);

/**
 * @swagger
 * /answers/{id}:
 *   put:
 *     summary: Update an existing answer
 *     tags: [Answers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the answer to be updated
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
 *                 example: "Updated answer content."
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answer updated successfully"
 *                 answer:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "Updated answer content."
 *                     userID:
 *                       type: integer
 *                       example: 1
 *                     postID:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Internal server error
 */
router.put('/answers/:id', auth, answerController.updateAnswer);

/**
 * @swagger
 * /answers/{id}:
 *   delete:
 *     summary: Delete an existing answer
 *     tags: [Answers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the answer to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Answer deleted successfully
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Internal server error
 */
router.delete('/answers/:id', auth, answerController.deleteAnswer);

module.exports = router;