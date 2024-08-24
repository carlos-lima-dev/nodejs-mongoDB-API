// src/validations/productValidation.ts
import {body, check} from "express-validator";

export const createProductValidation = [
  body("sku")
    .notEmpty()
    .withMessage("SKU is required")
    .isLength({min: 3})
    .withMessage("SKU must be at least 3 characters long")
    .trim()
    .escape(),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min: 3})
    .withMessage("Title must be at least 3 characters long")
    .trim()
    .escape(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({min: 0})
    .withMessage("Price must be a positive number"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({min: 10})
    .withMessage("Description must be at least 10 characters long")
    .trim()
    .escape(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim()
    .escape(),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),
];

export const updateProductValidation = [
  body("sku")
    .optional()
    .isLength({min: 3})
    .withMessage("SKU must be at least 3 characters long")
    .trim()
    .escape(),

  body("title")
    .optional()
    .isLength({min: 3})
    .withMessage("Title must be at least 3 characters long")
    .trim()
    .escape(),

  body("price")
    .optional()
    .isFloat({min: 0})
    .withMessage("Price must be a positive number"),

  body("description")
    .optional()
    .isLength({min: 10})
    .withMessage("Description must be at least 10 characters long")
    .trim()
    .escape(),

  body("category").optional().trim().escape(),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),
];
