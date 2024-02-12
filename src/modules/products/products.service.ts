import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { SortEnum } from 'src/enums';

import {
  AddProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './products.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return this.productModel.find();
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
}
