import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export interface Cart extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  products: Array<{
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }>;
}
