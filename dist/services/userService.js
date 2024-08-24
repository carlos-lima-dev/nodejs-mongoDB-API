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
const userModel_1 = require("../models/userModel");
const fileService_1 = __importDefault(require("../utils/fileService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const EmailService_1 = __importDefault(require("./EmailService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || "";
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const EMAIL_VERIFICATION_EXPIRATION = 3600000; // 1 hour in milliseconds
class UserService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.User.find();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.User.findById(id);
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.User.findOne({ email });
        });
    }
    create(data, avatarFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarFileName = avatarFile
                ? fileService_1.default.save(avatarFile)
                : "default-avatar.jpg";
            const hashedPassword = yield bcrypt_1.default.hash(data.password, BCRYPT_SALT_ROUNDS);
            const newUser = new userModel_1.User(Object.assign(Object.assign({}, data), { avatar: avatarFileName, password: hashedPassword, isVerified: false }));
            yield newUser.save();
            return newUser;
        });
    }
    generateVerificationToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationToken = (0, crypto_1.randomBytes)(32).toString("hex");
            const expires = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRATION);
            user.emailVerificationToken = verificationToken;
            user.emailVerificationExpires = expires;
            yield user.save();
            return verificationToken;
        });
    }
    update(id, data, avatarFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findById(id);
            if (!user)
                return null;
            if (avatarFile) {
                if (user.avatar && user.avatar !== "default-avatar.jpg") {
                    fileService_1.default.delete(user.avatar);
                }
                user.avatar = fileService_1.default.save(avatarFile);
            }
            if (data.password) {
                user.password = yield bcrypt_1.default.hash(data.password, BCRYPT_SALT_ROUNDS);
            }
            Object.assign(user, data);
            yield user.save();
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findByIdAndDelete(id);
            if (!user)
                return null;
            if (user.avatar && user.avatar !== "default-avatar.jpg") {
                fileService_1.default.delete(user.avatar);
            }
            return user;
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.User.findOne({
                    emailVerificationToken: token,
                    emailVerificationExpires: { $gt: new Date() },
                });
                if (!user) {
                    return { success: false, error: "Invalid or expired token" };
                }
                user.isVerified = true;
                user.emailVerificationToken = undefined;
                user.emailVerificationExpires = undefined;
                yield user.save();
                return { success: true };
            }
            catch (error) {
                console.error("Error in UserService verifying email:", error);
                return { success: false, error: "Internal server error" };
            }
        });
    }
    PasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email });
            if (!user)
                return null;
            const token = jsonwebtoken_1.default.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
            yield EmailService_1.default.sendPasswordResetEmail(user.email, user.username, token);
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
                if (typeof decoded === "object" && "id" in decoded) {
                    const userId = decoded.id;
                    const user = yield userModel_1.User.findById(userId);
                    if (!user)
                        throw new Error("User not found");
                    user.password = yield bcrypt_1.default.hash(newPassword, BCRYPT_SALT_ROUNDS);
                    yield user.save();
                }
                else {
                    throw new Error("Invalid or expired token");
                }
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw error;
            }
        });
    }
}
exports.default = new UserService();
