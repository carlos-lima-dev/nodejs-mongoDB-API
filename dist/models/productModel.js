"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    sku: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: String },
    images: { type: [String], required: true, default: ["/static/default.jpg"] }, // Imagem padrão
    thumbnail: { type: String },
    stock: { type: Number, required: true },
    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
    },
    colorOptions: { type: [String] },
    sizeOptions: { type: [String] },
    tags: { type: [String] },
    rating: {
        rate: { type: Number, min: 0, max: 5 },
        count: { type: Number },
    },
    discount: {
        percentage: { type: Number },
        validUntil: { type: Date },
    },
    reviews: [
        {
            userId: { type: Number, required: true },
            comment: { type: String, required: true },
            rating: { type: Number, required: true, min: 0, max: 5 },
            date: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    relatedProducts: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Product" },
    shippingDetails: {
        isFreeShipping: { type: Boolean, default: false },
        shippingCost: { type: Number },
        estimatedDelivery: { type: Date },
    },
});
exports.Product = mongoose_1.default.model("Product", productSchema);
