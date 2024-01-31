import { Schema } from 'mongoose';

export const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  },
);
export interface Cart {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
}
