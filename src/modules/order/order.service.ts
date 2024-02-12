import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { SortEnum } from 'src/enums';

import { UserIdRole } from 'src/interfaces';
import { OrderQueryInputDto } from './dto/order.dto';
import { OrderFilterType } from './interfaces/order.interface';
import { Order } from './order.model';
import { Product } from '../products/products.model';
import { Cart } from '../cart/cart.model';
import { RoleEnum } from '../user/user.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  // Create a Order
  async checkOut(userData: UserIdRole): Promise<void> {
    const userId = userData.userId;
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

  async filterOrder(
    queryData: OrderQueryInputDto,
    userData: UserIdRole,
  ): Promise<OrderFilterType[]> {
    const {
      userName,
      productName,
      maxAmount,
      minAmount,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = SortEnum.DESC,
    } = queryData;
    const { role, userId } = userData;

    let query = {}; // Define query as an empty object

    // Add conditions based on userName
    if (userName) {
      const regex = new RegExp(userName, 'i');
      query = {
        ...(role === RoleEnum.admin && { 'user.name': regex }), // Include condition if role is admin
      };
    }

    if (productName) {
      const productRegex = new RegExp(productName, 'i');
      query = {
        ...query, // Merge with existing query object
        'productsData.name': productRegex, // Add condition for product name
      };
    }

    // Add conditions based on userId and amount range
    query = {
      ...query, // Merge with existing query object
      ...(role === RoleEnum.user && userId && { userId }), // Include condition if role is user and userId is provided
      ...(maxAmount &&
        minAmount && { amount: { $gt: minAmount, $lte: maxAmount } }), // Include condition for amount range
    };

    const sortStage: PipelineStage = {
      $sort: {
        [sortBy]: sortOrder === SortEnum.DESC ? 1 : -1,
      },
    };

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productsData',
        },
      },
      {
        $match: query,
      },
      {
        $skip: (pageNumber - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
      {
        $group: {
          _id: null,
          Orders: { $push: '$$ROOT' },
          totalAmount: { $sum: '$amount' },
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
