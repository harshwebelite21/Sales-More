import * as mongoose from 'mongoose'

export const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  amount: {
    type: Number,
    require: true
  }
})

export interface Order extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId
  products: Array<{
    productId: mongoose.Schema.Types.ObjectId
    quantity: number
  }>
  amount: number
}
