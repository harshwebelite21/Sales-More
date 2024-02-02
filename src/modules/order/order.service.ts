import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.model';
import { Model, Types } from 'mongoose';
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
          userId,
        },
        { products: 1, _id: 0 },
      )
      .lean();

    if (!cartProducts) {
      throw new Error('User Cart Not found');
    }

    // Fetch all product details in one query
    const allProduct = await this.productModel.find({
      _id: { $in: cartProducts.products.map((product) => product.productId) },
    });

    // Validate product availability and calculate total bill in a single loop
    let totalBill = 0;
    for (const product of cartProducts.products) {
      const { productId, quantity } = product;
      const matchingProduct = allProduct.find(({ _id }) =>
        _id.equals(productId),
      );

      if (!matchingProduct) {
        throw new Error('Item Is Not Available');
      }

      if (quantity > matchingProduct.availableQuantity) {
        throw new Error(`${matchingProduct.name} Is Out Of Stock`);
      }

      // Increment the quantity in the product model
      await this.productModel.updateOne(
        { _id: productId },
        { $inc: { availableQuantity: -quantity } },
      );

      // Calculate the total bill
      totalBill += matchingProduct.price * quantity;
    }

    // Creating record in order table for history
    await this.orderModel.create({
      userId,
      products: cartProducts.products,
      amount: totalBill,
    });

    // To Delete cart from the Cart collection After saving History in Order Table
    await this.cartModel.deleteOne({ userId });
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

  async filterOrder(body) {
    const { userId, productId, maxAmount, minAmount, pageNumber, pageSize } =
      body;

    const query = {
      ...(userId && { userId: new Types.ObjectId(userId) }),
      ...(productId && { 'products.productId': new Types.ObjectId(productId) }),
      ...(maxAmount &&
        minAmount && { amount: { $gt: minAmount, $lte: maxAmount } }),
    };

    console.log('🚀 ~ OrderService ~ filterOrder ~ query:', query);

    const orderData = await this.orderModel.aggregate([
      {
        $match: query,
      },
      {
        $skip: (pageNumber - 1) * pageSize, // Skip documents based on the page number
      },
      {
        $limit: pageSize, // Limit the number of documents per page
      },
      {
        $group: {
          _id: null,
          Orders: { $push: '$$ROOT' },
          totalAmount: {
            $sum: '$amount',
          },
        },
      },
      {
        $project: {
          Orders: '$Orders',
          totalAmount: '$totalAmount',
        },
      },
    ]);

    console.log(orderData);
    return orderData;
  }
}
