import fileService from "../utils/fileService";
import {Product} from "../models/productModel";
import {IProduct} from "../models/productModel";
import {ProductQueryParams} from "../interfaces/interfaces";

class ProductService {
  async getAll(query: ProductQueryParams) {
    const {category, minPrice, maxPrice, page = 1, limit = 10} = query;
    const filters: any = {};

    if (category) filters.category = category;
    if (minPrice) filters.price = {...filters.price, $gte: minPrice};
    if (maxPrice) filters.price = {...filters.price, $lte: maxPrice};

    const skip = (page - 1) * limit;

    const products = await Product.find(filters).skip(skip).limit(limit);
    const total = await Product.countDocuments(filters);

    return {products, total, page, limit};
  }

  async getOne(productId: string) {
    return await Product.findById(productId).exec();
  }

  async create(productData: any, imageFiles: any[]): Promise<IProduct> {
    try {
      const {title, price, description, category, sku, stock} = productData;

      let images = ["default-product.png"];
      if (imageFiles && imageFiles.length > 0) {
        images = await Promise.all(
          imageFiles.map((file: any) => fileService.save(file))
        );
      }

      // Create a new product document
      const newProduct = new Product({
        sku,
        title,
        price,
        description,
        category,
        images,
        stock,
      });

      await newProduct.save();
      return newProduct.toObject() as IProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async update(
    productData: any,
    productId: string,
    imageFiles: any[]
  ): Promise<IProduct | undefined> {
    try {
      const {title, price, description, category, sku, stock} = productData;

      let updatedProduct = await Product.findById(productId).exec();

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
        await Promise.all(
          updatedProduct.images
            .filter((img) => img !== "default-product.png")
            .map((img) => fileService.delete(img))
        );
        // Save new images
        updatedProduct.images = await Promise.all(
          imageFiles.map((file) => fileService.save(file))
        );
      }

      await updatedProduct.save();
      return updatedProduct.toObject() as IProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async delete(productId: string): Promise<IProduct | undefined> {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId).exec();

      if (!deletedProduct) {
        return undefined;
      }

      // Delete the associated images from the server
      await Promise.all(
        deletedProduct.images
          .filter((img) => img !== "default-product.png")
          .map((img) => fileService.delete(img))
      );

      return deletedProduct.toObject();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export default new ProductService();
