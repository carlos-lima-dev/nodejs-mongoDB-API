import {Router} from "express";
import UserController from "../controllers/userController";
import {authenticateAndCheckRoles} from "../middleware/authMiddleware";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/UserValidations";
import {validateErrors} from "../utils/validateErros";
import {rateLimiter} from "../utils/rateLimiter";

// Create an instance of Router
const router = Router();

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
router.post("/login", rateLimiter, UserController.login);

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
router.post(
  "/users",
  rateLimiter,
  createUserValidation,
  validateErrors,
  UserController.createUser
);

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
router.get("/users", UserController.getAllUsers);

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
router.get("/users/:id", UserController.getUserById);

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
router.put(
  "/users/:id",
  updateUserValidation,
  validateErrors,
  authenticateAndCheckRoles(["admin"]),
  UserController.updateUser
);

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
router.delete(
  "/users/:id",
  authenticateAndCheckRoles(["admin"]),
  UserController.deleteUser
);
export default router;
