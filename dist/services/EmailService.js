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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    static sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: "Gmail", // Ensure this matches the service you're using
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            const verificationUrl = `http://127.0.0.1:5500/front-end/verification-success.html?token=${token}`;
            const mailOptions = {
                from: `Your Company Name <${process.env.GMAIL_USER}>`,
                to: email,
                subject: "Please Verify Your Email Address",
                html: `
        <html>
        <body>
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:
            </p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
              Verify Your Email
            </a>
            <p style="font-size: 14px; color: #777;">
              If you did not create an account, no further action is required.
            </p>
            <p style="font-size: 12px; color: #aaa;">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
            };
            try {
                yield transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error sending verification email:", error);
                throw new Error("Failed to send verification email");
            }
        });
    }
    static sendPasswordResetEmail(email, username, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: "Gmail", // Ensure this matches the service you're using
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            const resetPasswordUrl = `http://127.0.0.1:5500/front-end/reset-password.html?token=${token}`;
            const mailOptions = {
                from: `Your Company Name <${process.env.GMAIL_USER}>`,
                to: email,
                subject: "Password Reset Request",
                html: `
        <html>
        <body>
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #007bff;">Password Reset Request</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              Hi ${username},<br />
              You requested a password reset. Click the button below to set a new password:
            </p>
            <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
            <p style="font-size: 14px; color: #777;">
              If you did not request this, please ignore this email.
            </p>
            <p style="font-size: 12px; color: #aaa;">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
            };
            try {
                yield transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error sending password reset email:", error);
                throw new Error("Failed to send password reset email");
            }
        });
    }
}
exports.default = EmailService;
