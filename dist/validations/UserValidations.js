"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.validatePasswordReset = exports.updateUserValidation = exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createUserValidation = [
    (0, express_validator_1.body)("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .escape()
        .trim(), // Remove espaços em branco no início e no final
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address").trim(), // Remove espaços em branco no início e no final
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .trim(), // Remove espaços em branco no início e no final
    // Validação de arquivo (pode ser mais avançada dependendo do uso)
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .trim(), // Remove espaços em branco no início e no final
];
// Validações para atualização de usuário
exports.updateUserValidation = [
    (0, express_validator_1.body)("username")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .escape()
        .trim(), // Remove espaços em branco no início e no final
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .trim(), // Remove espaços em branco no início e no final
    (0, express_validator_1.body)("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .trim(), // Remove espaços em branco no início e no final
    // Validação de arquivo (pode ser mais avançada dependendo do uso)
    (0, express_validator_1.check)("avatar")
        .optional()
        .isString()
        .withMessage("Avatar must be a string")
        .trim(), // Remove espaços em branco no início e no final
];
exports.validatePasswordReset = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)("token").notEmpty().withMessage("Token is required").trim().escape(), // Trims and escapes the token string
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long")
        .matches(/\d/)
        .withMessage("Password must contain a number")
        .trim()
        .escape(), // Trims and escapes the new password string
];
