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
    category: {
      type: Number,
      required: true,
    },
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
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
  category: CategoryEnum;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

// category.enum.ts
export enum CategoryEnum {
  Clothing = 1,
  Electronics,
  HomeAndFurniture,
  SportsAndOutdoors,
}

export enum SortEnum {
  ASC = 'asc',
  DESC = 'desc',
}
