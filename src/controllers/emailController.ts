import {Request, Response} from "express";
import UserService from "../services/userService";
import dotenv from "dotenv";
import EmailService from "../services/EmailService";

dotenv.config();

class EmailController {
  // Email Verification
  async verifyEmail(req: Request, res: Response) {
    const {token} = req.query;

    if (typeof token !== "string") {
      return res.status(400).json({error: "Invalid token"});
    }

    try {
      const result = await UserService.verifyEmail(token);
      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Email verified successfully. You can now log in.",
        });
      } else {
        res.status(400).json({error: result.error});
      }
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async resendVerificationEmail(req: Request, res: Response) {
    try {
      const {email} = req.body;
      const user = await UserService.getByEmail(email);

      if (!user) return res.status(404).json({error: "Email not found"});

      if (user.isVerified)
        return res.status(400).json({error: "User already verified"});

      // Generate a new verification token
      const verificationToken = await UserService.generateVerificationToken(
        user
      );

      // Send verification email
      await EmailService.sendVerificationEmail(user.email, verificationToken);

      return res.status(200).json({message: "Verification email sent"});
    } catch (error) {
      return res.status(500).json({error: "Internal server error"});
    }
  }

  // Password Reset
  async requestPasswordReset(req: Request, res: Response) {
    const {email} = req.body;

    try {
      const user = await UserService.PasswordReset(email);
      if (!user) return res.status(404).json({error: "Email not found."});

      res.json({message: "Password reset email sent"});
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async requestUpdatePassword(req: Request, res: Response) {
    const {token, newPassword} = req.body;

    try {
      await UserService.updatePassword(token, newPassword);
      res.json({message: "Password updated successfully"});
    } catch (error) {
      res.status(400).json({error: "Invalid token or password update failed"});
    }
  }
}

export default new EmailController();
