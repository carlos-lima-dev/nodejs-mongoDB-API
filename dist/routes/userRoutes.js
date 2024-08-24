"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const UserValidations_1 = require("../validations/UserValidations");
const validateErros_1 = require("../utils/validateErros");
const rateLimiter_1 = require("../utils/rateLimiter");
// Create an instance of Router
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", rateLimiter_1.rateLimiter, userController_1.default.login);
/**
 * @swagger
 * /auth/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided data.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation errors
 */
router.post("/users", UserValidations_1.createUserValidation, validateErros_1.validateErrors, userController_1.default.createUser);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User related endpoints
 */
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", userController_1.default.getAllUsers);
/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID (MongoDB ObjectId)
 *           example: "60c72b2f9b1e8e001f647d2c"
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/users/:id", userController_1.default.getUserById);
/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user's information by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID (MongoDB ObjectId)
 *           example: "60c72b2f9b1e8e001f647d2c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             UserUpdateExample:
 *               summary: Example of user update data
 *               value:
 *                 username: "John Doe"
 *                 email: "john.doe@example.com"
 *                 password: "newpassword123"
 *                 avatar: "http://example.com/avatar.jpg"
 *                 role: "user"
 *                 isVerified: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation errors
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/users/:id", UserValidations_1.updateUserValidation, validateErros_1.validateErrors, (0, authMiddleware_1.authenticateAndCheckRoles)(["admin"]), userController_1.default.updateUser);
/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID (MongoDB ObjectId)
 *           example: "60c72b2f9b1e8e001f647d2c"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/users/:id", userController_1.default.deleteUser);
/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify email address
 *     description: Verify the user's email address using a token sent to their email.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: The email verification token
 *           example: "d036bff989e1c0830020518d005e47135750b91cbeaabfc188e83445235cbecb"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get("/verify-email", rateLimiter_1.rateLimiter, userController_1.default.verifyEmail);
/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     description: Resend the email verification token to the user's email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification email sent"
 *       404:
 *         description: Email not found
 *       400:
 *         description: User already verified
 *       500:
 *         description: Internal server error
 */
router.post("/resend-verification", rateLimiter_1.rateLimiter, userController_1.default.resendVerificationEmail);
/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/request-password-reset", UserValidations_1.validatePasswordReset, validateErros_1.validateErrors, rateLimiter_1.rateLimiter, userController_1.default.requestPasswordReset);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user's password using the provided token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token
 *                 example: "d036bff989e1c0830020518d005e47135750b91cbeaabfc188e83445235cbecb"
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", rateLimiter_1.rateLimiter, UserValidations_1.resetPasswordValidation, validateErros_1.validateErrors, userController_1.default.requestUpdatePassword);
exports.default = router;
