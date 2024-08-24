import {User, IUser} from "../models/userModel";
import FileService from "../utils/fileService";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import EmailService from "./EmailService";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "";
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const EMAIL_VERIFICATION_EXPIRATION = 3600000; // 1 hour in milliseconds

class UserService {
  async getAll() {
    return User.find();
  }

  async getById(id: string) {
    return User.findById(id);
  }

  async getByEmail(email: string) {
    return User.findOne({email});
  }

  async create(data: IUser, avatarFile?: any) {
    const avatarFileName = avatarFile
      ? FileService.save(avatarFile)
      : "default-avatar.jpg";

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    const newUser = new User({
      ...data,
      avatar: avatarFileName,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();
    return newUser;
  }

  async generateVerificationToken(user: IUser): Promise<string> {
    const verificationToken = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRATION);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = expires;

    await user.save();
    return verificationToken;
  }

  async update(id: string, data: IUser, avatarFile?: any) {
    const user = await User.findById(id);
    if (!user) return null;

    if (avatarFile) {
      if (user.avatar && user.avatar !== "default-avatar.jpg") {
        FileService.delete(user.avatar);
      }
      user.avatar = FileService.save(avatarFile);
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }

    Object.assign(user, data);
    await user.save();
    return user;
  }

  async delete(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) return null;

    if (user.avatar && user.avatar !== "default-avatar.jpg") {
      FileService.delete(user.avatar);
    }

    return user;
  }

  async verifyEmail(
    token: string
  ): Promise<{success: boolean; error?: string}> {
    try {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: {$gt: new Date()},
      });

      if (!user) {
        return {success: false, error: "Invalid or expired token"};
      }

      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;

      await user.save();
      return {success: true};
    } catch (error) {
      console.error("Error in UserService verifying email:", error);
      return {success: false, error: "Internal server error"};
    }
  }

  async PasswordReset(email: string) {
    const user = await User.findOne({email});
    if (!user) return null;

    const token = jwt.sign({id: user._id}, SECRET_KEY, {expiresIn: "1h"});
    await EmailService.sendPasswordResetEmail(user.email, user.username, token);
  }

  async updatePassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      if (typeof decoded === "object" && "id" in decoded) {
        const userId = (decoded as {id: string}).id;
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        await user.save();
      } else {
        throw new Error("Invalid or expired token");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
}

export default new UserService();
