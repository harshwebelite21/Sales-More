import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class OrderServices {
  constructor (
    @InjectModel('Order') private readonly orderModel: Model<'Order'>,
    @InjectModel('Order') private readonly cartModel: Model<'Cart'>,
    @InjectModel('User') private readonly userModel: Model<'User'>,
    @InjectModel('Product') private readonly productModel: Model<'Product'>
  ) {}

  // Create a Order
  async checkOut (userId) {
    try {
      // Find the Cart products Of the specific user
      const cartProducts = await this.cartModel
        .findOne(
          {
            userId
          },
          { products: 1, _id: 0 }
        )
        .lean()

      // Mapping the the product Id from cart Products
      const allProductId = cartProducts.products.map(
        (product) => product.productId
      )

      // Find the product details from the product Collection which id is in allProductId
      const allProduct = await this.productModel.find({
        _id: { $in: allProductId }
      })

      // Finding the Total Amount of All Product in cart
      let totalBill = 0
      allProduct.forEach(({ _id, price }) => {
        const matchingProduct = cartProducts.products.find(({ productId }) =>
          _id.equals(productId)
        )

        if (matchingProduct) {
          totalBill += price * matchingProduct.quantity
        }
      })

      // Creating record in order table for history
      await this.orderModel.create({
        userId,
        products: cartProducts.products,
        amount: totalBill
      })

      // To Delete cart from the Cart collection After saving History in Order Table
      await this.cartModel.deleteOne({ userId })
      return 'Order Placed Successfully'
    } catch (err) {
      return `" Error in Checkout Process :" + ${err.message}`
    }
  }

  // View the user data from Order
  async getOrderHistory (userId) {
    try {
      const orderData = await this.orderModel
        .findOne({ userId })
        .populate('userId')
        .populate('products.productId')
        .lean()
      return `${JSON.stringify(orderData)}`
    } catch (err) {
      return `${err.message} + "Fetching data "`
    }
  }
}
