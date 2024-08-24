"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmailService_1 = __importDefault(require("../services/EmailService"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
class UserController {
    // User Management
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.default.getAll();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService_1.default.getById(req.params.id);
                if (!user)
                    return res.status(404).json({ error: "User not found" });
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email } = req.body;
                // Check if email already exists
                const user = yield userService_1.default.getByEmail(email);
                if (user)
                    return res
                        .status(409)
                        .json({ error: "This email is already registered" });
                const avatarFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar;
                const newUser = yield userService_1.default.create(req.body, avatarFile);
                // Generate email verification token
                const verificationToken = yield userService_1.default.generateVerificationToken(newUser);
                // Send verification email
                yield EmailService_1.default.sendVerificationEmail(newUser.email, verificationToken);
                res.status(201).json({
                    message: "User created successfully. Please check your email to verify your account.",
                    userId: newUser._id,
                    email: newUser.email,
                });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const avatarFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar;
                const updatedUser = yield userService_1.default.update(id, req.body, avatarFile);
                if (!updatedUser)
                    return res.status(404).json({ error: "User not found" });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield userService_1.default.delete(req.params.id);
                if (!deletedUser)
                    return res.status(404).json({ error: "User not found" });
                res.status(200).json({ message: "User successfully deleted" });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    // Authentication and Authorization
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation rules
            yield (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format").run(req);
            yield (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { email, password } = req.body;
                // Find the user by email
                const user = yield userService_1.default.getByEmail(email);
                if (!user)
                    return res.status(404).json({ error: "User not found" });
                // Check password
                const isMatch = yield bcrypt_1.default.compare(password.trim(), user.password);
                if (!isMatch)
                    return res.status(401).json({ error: "Invalid credentials" });
                // Check if user is verified
                if (!user.isVerified)
                    return res.status(401).json({ error: "User not verified" });
                // Generate JWT token with expiration
                const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, SECRET_KEY, {
                    expiresIn: JWT_EXPIRES_IN,
                });
                res.status(200).json({ token });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    // Email Verification
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            if (typeof token !== "string") {
                return res.status(400).json({ error: "Invalid token" });
            }
            try {
                const result = yield userService_1.default.verifyEmail(token);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        message: "Email verified successfully. You can now log in.",
                    });
                }
                else {
                    res.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    resendVerificationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userService_1.default.getByEmail(email);
                if (!user)
                    return res.status(404).json({ error: "Email not found" });
                if (user.isVerified)
                    return res.status(400).json({ error: "User already verified" });
                // Generate a new verification token
                const verificationToken = yield userService_1.default.generateVerificationToken(user);
                // Send verification email
                yield EmailService_1.default.sendVerificationEmail(user.email, verificationToken);
                return res.status(200).json({ message: "Verification email sent" });
            }
            catch (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    // Password Reset
    requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield userService_1.default.PasswordReset(email);
                if (!user)
                    return res.status(404).json({ error: "Email not found." });
                res.json({ message: "Password reset email sent" });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    requestUpdatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            try {
                yield userService_1.default.updatePassword(token, newPassword);
                res.json({ message: "Password updated successfully" });
            }
            catch (error) {
                res.status(400).json({ error: "Invalid token or password update failed" });
            }
        });
    }
}
exports.default = new UserController();
