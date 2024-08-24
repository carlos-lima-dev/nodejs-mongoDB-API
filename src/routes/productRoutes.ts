import {Router} from "express";
import productController from "../controllers/productController";
import {authenticateAndCheckRoles} from "../middleware/authMiddleware";
import {
  createProductValidation,
  updateProductValidation,
} from "../validations/ProductValidation";
import {validateErrors} from "../utils/validateErros";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product related endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/products", productController.getAllProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a single product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The product ID (MongoDB ObjectId)
 *           example: 507f1f77bcf86cd799439011
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.get("/products/:id", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided data.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation errors
 */
router.post(
  "/products",
  createProductValidation,
  validateErrors,
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update a product's information by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The product ID (MongoDB ObjectId)
 *           example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/products/:id",
  updateProductValidation,
  validateErrors,
  authenticateAndCheckRoles(["admin"]),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The product ID (MongoDB ObjectId)
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/products/:id",
  authenticateAndCheckRoles(["admin"]),
  productController.deleteProduct
);

export default router;
