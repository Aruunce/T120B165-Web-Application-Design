const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  loginUser,
  getUserProfile,
  getAllUsers,
  registerUser,
  deleteUser,
  getUserPosts
} = require('../controllers/UserController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management.
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user with their username and password, and returns a JWT token if the credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Successfully logged in. Returns the JWT token and user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       format: int64
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Bad Request. Invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details. The user role defaults to 'user' if not specified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword123
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User successfully registered. Returns the newly created user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                       format: int64
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     roleID:
 *                       type: integer
 *                       format: int64
 *                       example: 2
 *       400:
 *         description: Bad Request. The provided username is already taken or other validation issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username already taken
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile information of the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The profile information of the current user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: integer
 *                   format: int64
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: john_doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *       404:
 *         description: Not Found. The user profile could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/profile', auth, getUserProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userID:
 *                     type: integer
 *                     format: int64
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: john_doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/allUsers', getAllUsers);

/**
 * @swagger
 * /users/{id}/posts:
 *   get:
 *     summary: Get all posts by a user
 *     description: Retrieves all posts made by a specific user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose posts are to be retrieved
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: A list of posts made by the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID:
 *                     type: integer
 *                     format: int64
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: This is a post content
 *                   postType:
 *                     type: string
 *                     example: text
 *                   userID:
 *                     type: integer
 *                     format: int64
 *                     example: 1
 *       404:
 *         description: Not Found. The user with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/users/:id/posts', getUserPosts);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID. Only admins or the user themselves can perform this action.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       204:
 *         description: User successfully deleted. No content returned.
 *       403:
 *         description: Forbidden. User is not authorized to delete this resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized to delete this user
 *       404:
 *         description: Not Found. The user with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error. An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/users/:id', deleteUser);

module.exports = router;