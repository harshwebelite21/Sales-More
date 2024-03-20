import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { launch } from 'puppeteer';
import { SortEnum } from 'enums';
import { compile } from 'handlebars';
import { readFile } from 'fs-extra';

import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { convertToObjectId } from 'utils/converter';
import { OrderQueryInputDto } from './dto/order.dto';
import { BillingData, OrderFilterType } from './interfaces/order.interface';
import { Order } from './order.model';
import { Product } from '../products/products.model';
import { Cart } from '../cart/cart.model';
import { Role } from '../user/user.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  // Create a Order
  async checkOut(userData: UserIdRole): Promise<void> {
    const userId = convertToObjectId(userData.userId);
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
    // To Generate Bill
    await this.billGenerator(userId);

    // To Delete cart from the Cart collection After saving History in Order Table
    await this.cartModel.deleteOne({ userId });
  }

  async filterOrder(
    queryData: OrderQueryInputDto,
    userData: UserIdRole,
  ): Promise<OrderFilterType[]> {
    const {
      search,
      maxAmount,
      minAmount,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = SortEnum.DESC,
    } = queryData;
    const { role } = userData;
    const userId = convertToObjectId(userData.userId);

    let query = {}; // Define query as an empty object

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        ...(role === Role.Admin && { 'user.name': searchRegex }),
        'productsData.name': searchRegex,
      };
    }

    // Add conditions based on userId and amount range
    query = {
      ...query, // Merge with existing query object
      ...(role === Role.User && { userId }), // Include condition if role is user and userId is provided
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

  // Bill Generation
  private async billGenerator(userId): Promise<void> {
    const htmlCompile = async (data: BillingData): Promise<string> => {
      const html = await readFile(
        'src/modules/order/templates/index.hbs',
        'utf8',
      );
      return compile(html)(data);
    };

    const data = await this.orderModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productData',
        },
      },
      {
        $project: {
          username: '$user.name',
          email: '$user.email',
          address: '$user.address',
          createdAt: 1,
          mobile: '$user.mobile',
          amount: 1,
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                productName: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: '$productData',
                            as: 'pd',
                            cond: {
                              $eq: ['$$pd._id', '$$product.productId'],
                            },
                          },
                        },
                        as: 'pd',
                        in: '$$pd.name',
                      },
                    },
                    0,
                  ],
                },
                quantity: '$$product.quantity',
                price: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: '$productData',
                            as: 'pd',
                            cond: {
                              $eq: ['$$pd._id', '$$product.productId'],
                            },
                          },
                        },
                        as: 'pd',
                        in: '$$pd.price',
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    // Process The Payment Before Bill Generation
    await this.processPayment(data[0].amount);

    // Start Creating Bill
    const content = await htmlCompile(data[0]);
    const browser = await launch();
    const page = await browser.newPage();
    await page.setContent(content);
    // Save Pdf To Location
    await page.pdf({
      path: `src/modules/order/bills/${data[0]._id}.pdf`,
      format: 'A4',
      printBackground: true,
    });

    console.log('Bill generated successfully!');
    await browser.close();
    // Bill Creating Off
  }

  private async processPayment(amount): Promise<SuccessMessageDTO> {
    const isSuccess = Math.random() < 0.9; // 80% chance of success

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isSuccess) {
          resolve({
            success: true,
            message: `${amount} Paid successfully.`,
          });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 1000);
    });
  }
}
