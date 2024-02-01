import { Schema } from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  },
);

export interface Product {
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
}
