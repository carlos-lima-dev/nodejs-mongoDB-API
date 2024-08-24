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
const productService_1 = __importDefault(require("../services/productService"));
class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const productsData = yield productService_1.default.getAll(query);
                return res.json(productsData);
            }
            catch (error) {
                console.error("Error getting all products:", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield productService_1.default.getOne(req.params.id);
                if (!product) {
                    return res.status(404).json({ error: "Product not found." });
                }
                return res.json(product);
            }
            catch (error) {
                console.error("Error getting product by ID:", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Normalize imageFiles to always be an array
                const imageFiles = Array.isArray((_a = req.files) === null || _a === void 0 ? void 0 : _a.images)
                    ? req.files.images
                    : ((_b = req.files) === null || _b === void 0 ? void 0 : _b.images)
                        ? [req.files.images]
                        : [];
                const newProduct = yield productService_1.default.create(req.body, imageFiles);
                return res.status(201).json(newProduct);
            }
            catch (error) {
                console.error("Error creating product:", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Normalize imageFiles to always be an array
                const imageFiles = Array.isArray((_a = req.files) === null || _a === void 0 ? void 0 : _a.images)
                    ? req.files.images
                    : ((_b = req.files) === null || _b === void 0 ? void 0 : _b.images)
                        ? [req.files.images]
                        : [];
                const updatedProduct = yield productService_1.default.update(req.body, req.params.id, imageFiles);
                if (!updatedProduct) {
                    return res.status(404).json({ error: "Product not found." });
                }
                return res.json(updatedProduct);
            }
            catch (error) {
                console.error("Error updating product:", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedProduct = yield productService_1.default.delete(req.params.id);
                if (!deletedProduct) {
                    return res.status(404).json({ error: "Product not found." });
                }
                return res.json({ message: "Product successfully deleted." });
            }
            catch (error) {
                console.error("Error deleting product:", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }
}
exports.default = new ProductController();
