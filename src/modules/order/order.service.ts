import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.model';
import { Model } from 'mongoose';
import { Cart } from '../cart/cart.model';
import { Product } from '../products/products.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  // Create a Order
  async checkOut(userId): Promise<boolean> {
    // Find the Cart products Of the specific user
    const cartProducts = await this.cartModel
      .findOne(
        {
          userId: userId,
        },
        { products: 1, _id: 0 },
      )
      .lean();

    if (!cartProducts) {
      throw Error('Error During Checkout');
    }
    // Mapping the the product Id from cart Products
    const allProductId = cartProducts.products.map(
      (product) => product.productId,
    );

    // Find the product details from the product Collection which id is in allProductId
    const allProduct = await this.productModel.find({
      _id: { $in: allProductId },
    });

    // Finding the Total Amount of All Product in cart
    let totalBill = 0;
    allProduct.forEach(({ _id, price }) => {
      const matchingProduct = cartProducts.products.find(({ productId }) =>
        _id.equals(productId),
      );

      if (matchingProduct) {
        totalBill += price * matchingProduct.quantity;
      }
    });

    // Creating record in order table for history
    await this.orderModel.create({
      userId: userId,
      products: cartProducts.products,
      amount: totalBill,
    });

    // To Delete cart from the Cart collection After saving History in Order Table
    await this.cartModel.deleteOne({ userId: userId });
    return true;
  }

  // View the user data from Order
  async getOrderHistory(userId): Promise<Order> {
    const orderData = await this.orderModel
      .findOne({ userId: userId })
      .populate('userId')
      .populate('products.productId')
      .lean();

    if (!orderData) {
      throw Error('No Order History found');
    }
    return orderData;
  }
}
