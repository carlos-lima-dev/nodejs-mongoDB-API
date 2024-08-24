import {body, check} from "express-validator";
export const createUserValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({min: 3})
    .withMessage("Username must be at least 3 characters long")
    .escape()
    .trim(), // Remove espaços em branco no início e no final

  body("email").isEmail().withMessage("Invalid email address").trim(), // Remove espaços em branco no início e no final

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long")
    .trim(), // Remove espaços em branco no início e no final

  // Validação de arquivo (pode ser mais avançada dependendo do uso)
  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .trim(), // Remove espaços em branco no início e no final
];

// Validações para atualização de usuário
export const updateUserValidation = [
  body("username")
    .optional()
    .isLength({min: 3})
    .withMessage("Username must be at least 3 characters long")
    .escape()
    .trim(), // Remove espaços em branco no início e no final

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .trim(), // Remove espaços em branco no início e no final

  body("password")
    .optional()
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long")
    .trim(), // Remove espaços em branco no início e no final

  // Validação de arquivo (pode ser mais avançada dependendo do uso)
  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .trim(), // Remove espaços em branco no início e no final
];

export const validatePasswordReset = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
];
export const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Token is required").trim().escape(), // Trims and escapes the token string
  body("newPassword")
    .isLength({min: 6})
    .withMessage("New password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .trim()
    .escape(), // Trims and escapes the new password string
];
