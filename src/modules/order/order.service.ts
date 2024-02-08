import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Order } from './order.model';
import { Cart } from '../cart/cart.model';
import { Product } from '../products/products.model';
import { OrderFilterType } from './interfaces/order.interface';
import { SortEnum } from 'src/enums';
import { OrderQueryInputDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  // Create a Order
  async checkOut(userId): Promise<void> {
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
  }

  // View the user data from Order
  async getOrderHistory(userId): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .populate('userId')
      .populate('products.productId')
      .lean();
  }

  async filterOrder(queryData: OrderQueryInputDto): Promise<OrderFilterType[]> {
    const {
      userId,
      productId,
      maxAmount,
      minAmount,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder,
    } = queryData;

    const query = {
      ...(userId && { userId: new Types.ObjectId(userId) }),
      ...(productId && { 'products.productId': new Types.ObjectId(productId) }),
      ...(maxAmount &&
        minAmount && { amount: { $gt: minAmount, $lte: maxAmount } }),
    };
    const sortStage: PipelineStage = {
      $sort: {
        [sortBy]: sortOrder === SortEnum.DESC ? 1 : -1,
      },
    };

    const pipeline: PipelineStage[] = [
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
      sortStage,
    ];

    return this.orderModel.aggregate(pipeline).exec();
  }
}
