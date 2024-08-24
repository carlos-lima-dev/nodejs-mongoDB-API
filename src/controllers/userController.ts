import {Request, Response} from "express";
import UserService from "../services/userService";
import {body, validationResult} from "express-validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import EmailService from "../services/EmailService";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

class UserController {
  // User Management
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return res.status(404).json({error: "User not found"});
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const {email} = req.body;

      // Check if email already exists
      const user = await UserService.getByEmail(email);
      if (user)
        return res
          .status(409)
          .json({error: "This email is already registered"});

      const avatarFile = req.files?.avatar;
      const newUser = await UserService.create(req.body, avatarFile);

      // Generate email verification token
      const verificationToken = await UserService.generateVerificationToken(
        newUser
      );

      // Send verification email
      await EmailService.sendVerificationEmail(
        newUser.email,
        verificationToken
      );

      res.status(201).json({
        message:
          "User created successfully. Please check your email to verify your account.",
        userId: newUser._id,
        email: newUser.email,
      });
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const avatarFile = req.files?.avatar;

      const updatedUser = await UserService.update(id, req.body, avatarFile);
      if (!updatedUser) return res.status(404).json({error: "User not found"});

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const deletedUser = await UserService.delete(req.params.id);
      if (!deletedUser) return res.status(404).json({error: "User not found"});

      res.status(200).json({message: "User successfully deleted"});
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

  // Authentication and Authorization
  async login(req: Request, res: Response) {
    // Validation rules
    await body("email").isEmail().withMessage("Invalid email format").run(req);
    await body("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const {email, password} = req.body;

      // Find the user by email
      const user = await UserService.getByEmail(email);
      if (!user) return res.status(404).json({error: "User not found"});

      // Check password
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) return res.status(401).json({error: "Invalid credentials"});

      // Check if user is verified
      if (!user.isVerified)
        return res.status(401).json({error: "User not verified"});

      // Generate JWT token with expiration
      const token = jwt.sign({id: user._id, role: user.role}, SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN,
      });

      res.status(200).json({token});
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  }

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

export default new UserController();
