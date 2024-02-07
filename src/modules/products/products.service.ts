import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Product, SortEnum } from './products.model';
import {
  AddProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const productData = await this.productModel.find();
    return productData;
  }

  // Add product data
  async addProducts(body: AddProductDto): Promise<boolean> {
    await this.productModel.create(body);
    return true;
  }

  // Update product data
  async updateProduct(
    body: UpdateProductDto,
    productId: string,
  ): Promise<boolean> {
    await this.productModel.updateOne({ _id: productId }, body);
    return true;
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<boolean> {
    await this.productModel.findByIdAndDelete(productId);
    return true;
  }

  // Filter Product
  async filterProduct(queryData: FilterProductDto) {
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
    const regex = new RegExp(name, 'i');

    const sortStage: PipelineStage = {
      $sort: {
        [sortBy]: sortOrder === SortEnum.DESC ? 1 : -1,
      },
    };
    const query = {
      ...(name && { name: { $regex: regex } }),
      ...(category && { category }),
      ...(attributeName && { 'attributes.name': attributeName }),
      ...(attributeValue && { 'attributes.value': attributeValue }),
      ...(minPrice &&
        maxPrice && { price: { $gte: minPrice, $lte: maxPrice } }),
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
