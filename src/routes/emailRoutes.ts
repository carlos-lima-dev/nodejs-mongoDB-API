import {Router} from "express";
import EmailController from "../controllers/emailController";
import {validateErrors} from "../utils/validateErros";
import {rateLimiter} from "../utils/rateLimiter";
import {
  validatePasswordReset,
  resetPasswordValidation,
} from "../validations/UserValidations";
// Create an instance of Router
const router = Router();

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify email address
 *     description: Verify the user's email address using a token sent to their email.
 *     tags: [Auth]
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
router.get("/verify-email", rateLimiter, EmailController.verifyEmail);

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
router.post(
  "/resend-verification",
  rateLimiter,
  EmailController.resendVerificationEmail
);

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
router.post(
  "/request-password-reset",
  validatePasswordReset,
  validateErrors,
  rateLimiter,
  EmailController.requestPasswordReset
);

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
router.post(
  "/reset-password",
  rateLimiter,
  resetPasswordValidation,
  validateErrors,
  EmailController.requestUpdatePassword
);

export default router;
