import mongoose, {Document, Schema} from "mongoose";

export interface IProduct extends Document {
  sku: string;
  title: string;
  price: number;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  images: string[];
  thumbnail?: string;
  stock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  colorOptions?: string[];
  sizeOptions?: string[];
  tags?: string[];
  rating?: {
    rate: number;
    count: number;
  };
  discount?: {
    percentage: number;
    validUntil: Date;
  };
  reviews?: {
    userId: number;
    comment: string;
    rating: number;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt?: Date;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  relatedProducts?: mongoose.Types.ObjectId[];
  shippingDetails?: {
    isFreeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery: Date;
  };
}

const productSchema = new Schema<IProduct>({
  sku: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  category: {type: String, required: true},
  subCategory: {type: String},
  brand: {type: String},
  images: {type: [String], required: true, default: ["/static/default.jpg"]}, // Imagem padrão
  thumbnail: {type: String},
  stock: {type: Number, required: true},
  weight: {type: Number},
  dimensions: {
    length: {type: Number},
    width: {type: Number},
    height: {type: Number},
  },
  colorOptions: {type: [String]},
  sizeOptions: {type: [String]},
  tags: {type: [String]},
  rating: {
    rate: {type: Number, min: 0, max: 5},
    count: {type: Number},
  },
  discount: {
    percentage: {type: Number},
    validUntil: {type: Date},
  },
  reviews: [
    {
      userId: {type: Number, required: true},
      comment: {type: String, required: true},
      rating: {type: Number, required: true, min: 0, max: 5},
      date: {type: Date, default: Date.now},
    },
  ],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
  isFeatured: {type: Boolean, default: false},
  isNewArrival: {type: Boolean, default: false},
  relatedProducts: {type: [Schema.Types.ObjectId], ref: "Product"},
  shippingDetails: {
    isFreeShipping: {type: Boolean, default: false},
    shippingCost: {type: Number},
    estimatedDelivery: {type: Date},
  },
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
