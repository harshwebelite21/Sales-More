import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { SortEnum } from 'enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { Ticket } from 'modules/customer-support/customer-support.model';
import { convertToObjectId } from 'utils/converter';
import {
  AddProductDto,
  AdminTicketQueryDataDto,
  FilterProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './products.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
    @InjectModel('Ticket')
    private readonly ticketModel: Model<Ticket>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const cacheData: Product[] | undefined =
      await this.cacheService.get('products');
    if (cacheData && cacheData.length > 0) {
      return cacheData;
    } else {
      const data: Product[] = await this.productModel.find();
      await this.cacheService.set('products', data, 60000);
      return data;
    }
  }

  // Add product data
  async addProducts(body: AddProductDto): Promise<void> {
    await this.productModel.create(body);
  }

  // Update product data
  async updateProduct(
    body: UpdateProductDto,
    productId: string,
  ): Promise<void> {
    await this.productModel.updateOne({ _id: productId }, body);
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<void> {
    await this.productModel.findByIdAndDelete(productId);
  }

  // Filter Product
  async filterProduct(queryData: FilterProductDto): Promise<Product[]> {
    const {
      name,
      category,
      maxPrice,
      minPrice,
      attributeName,
      attributeValue,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt', // New parameter for sorting
      sortOrder = SortEnum.DESC, // Default to ascending order
    } = queryData;

    let query = {}; // Define query as an empty object

    // Add conditions based on userName
    if (name) {
      const regex = new RegExp(name, 'i');
      query = {
        ...query,
        'user.name': regex, // Include condition if role is admin
      };
    }
    query = {
      ...query,
      ...(category && { category }),
      ...(attributeName && { 'attributes.name': attributeName }),
      ...(attributeValue && { 'attributes.value': attributeValue }),
      ...(minPrice &&
        maxPrice && { price: { $gte: minPrice, $lte: maxPrice } }),
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
      sortStage,
      {
        $skip: (pageNumber - 1) * pageSize, // Skip documents based on the page number
      },
      {
        $limit: pageSize, // Limit the number of documents per page
      },
    ];
    return this.productModel.aggregate(pipeline).exec();
  }

  // Tickets By ProductId
  async ticketsByProductId(
    productId: string,
    userId: string,
  ): Promise<Ticket[]> {
    return this.ticketModel.find({
      productId: convertToObjectId(productId),
      userId: convertToObjectId(userId),
    });
  }

  // Tickets By Admin
  async ticketsByAdmin(queryData: AdminTicketQueryDataDto): Promise<Ticket[]> {
    const { productName, userName } = queryData;
    const query = {
      ...(productName && {
        'productsData.name': new RegExp(productName, 'i'),
      }),
      ...(userName && {
        'user.name': new RegExp(userName, 'i'),
      }),
    };

    return this.ticketModel.aggregate([
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
          localField: 'productId',
          foreignField: '_id',
          as: 'productsData',
        },
      },
      {
        $unwind: '$productsData',
      },
      {
        $match: query,
      },
    ]);
  }
}
