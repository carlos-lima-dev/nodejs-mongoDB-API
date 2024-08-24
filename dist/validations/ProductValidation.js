"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidation = exports.createProductValidation = void 0;
// src/validations/productValidation.ts
const express_validator_1 = require("express-validator");
exports.createProductValidation = [
    (0, express_validator_1.body)("sku")
        .notEmpty()
        .withMessage("SKU is required")
        .isLength({ min: 3 })
        .withMessage("SKU must be at least 3 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("Category is required")
        .trim()
        .escape(),
    (0, express_validator_1.check)("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings"),
];
exports.updateProductValidation = [
    (0, express_validator_1.body)("sku")
        .optional()
        .isLength({ min: 3 })
        .withMessage("SKU must be at least 3 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("category").optional().trim().escape(),
    (0, express_validator_1.check)("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings"),
];
