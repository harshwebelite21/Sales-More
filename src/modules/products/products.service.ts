import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.model';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const productData = await this.productModel.find();
    if (!productData) {
      throw Error('Error in Viewing Data');
    }
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
}
