import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  },
);

export interface Product extends mongoose.Document {
  name: string;
  description: string;
  price: number;
}
