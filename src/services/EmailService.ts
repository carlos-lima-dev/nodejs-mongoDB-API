import nodemailer from "nodemailer";

export default class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
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
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  static async sendPasswordResetEmail(
    email: string,
    username: string,
    token: string
  ) {
    const transporter = nodemailer.createTransport({
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
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }
}
