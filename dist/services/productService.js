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
const fileService_1 = __importDefault(require("../utils/fileService"));
const productModel_1 = require("../models/productModel");
class ProductService {
    getAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, minPrice, maxPrice, page = 1, limit = 10 } = query;
            const filters = {};
            if (category)
                filters.category = category;
            if (minPrice)
                filters.price = Object.assign(Object.assign({}, filters.price), { $gte: minPrice });
            if (maxPrice)
                filters.price = Object.assign(Object.assign({}, filters.price), { $lte: maxPrice });
            const skip = (page - 1) * limit;
            const products = yield productModel_1.Product.find(filters).skip(skip).limit(limit);
            const total = yield productModel_1.Product.countDocuments(filters);
            return { products, total, page, limit };
        });
    }
    getOne(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield productModel_1.Product.findById(productId).exec();
        });
    }
    create(productData, imageFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, price, description, category, sku, stock } = productData;
                let images = ["default-product.png"];
                if (imageFiles && imageFiles.length > 0) {
                    images = yield Promise.all(imageFiles.map((file) => fileService_1.default.save(file)));
                }
                // Create a new product document
                const newProduct = new productModel_1.Product({
                    sku,
                    title,
                    price,
                    description,
                    category,
                    images,
                    stock,
                });
                yield newProduct.save();
                return newProduct.toObject();
            }
            catch (error) {
                console.error("Error creating product:", error);
                throw error;
            }
        });
    }
    update(productData, productId, imageFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, price, description, category, sku, stock } = productData;
                let updatedProduct = yield productModel_1.Product.findById(productId).exec();
                if (!updatedProduct) {
                    return undefined;
                }
                updatedProduct.title = title;
                updatedProduct.price = price;
                updatedProduct.description = description;
                updatedProduct.category = category;
                updatedProduct.sku = sku;
                updatedProduct.stock = stock;
                if (imageFiles && imageFiles.length > 0) {
                    // Delete existing images except the default
                    yield Promise.all(updatedProduct.images
                        .filter((img) => img !== "default-product.png")
                        .map((img) => fileService_1.default.delete(img)));
                    // Save new images
                    updatedProduct.images = yield Promise.all(imageFiles.map((file) => fileService_1.default.save(file)));
                }
                yield updatedProduct.save();
                return updatedProduct.toObject();
            }
            catch (error) {
                console.error("Error updating product:", error);
                throw error;
            }
        });
    }
    delete(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedProduct = yield productModel_1.Product.findByIdAndDelete(productId).exec();
                if (!deletedProduct) {
                    return undefined;
                }
                // Delete the associated images from the server
                yield Promise.all(deletedProduct.images
                    .filter((img) => img !== "default-product.png")
                    .map((img) => fileService_1.default.delete(img)));
                return deletedProduct.toObject();
            }
            catch (error) {
                console.error("Error deleting product:", error);
                throw error;
            }
        });
    }
}
exports.default = new ProductService();
