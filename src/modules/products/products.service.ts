import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.model';
import { UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<string> {
    const productData = await this.productModel.find();
    if (!productData) {
      throw Error('Error in Viewing Data');
    }
    return 'productData';
  }

  // Add product data
  async addProducts(body): Promise<string> {
    await this.productModel.create(body);
    return 'Data added successfully';
  }

  // Update product data
  async updateProduct(
    body: UpdateProductDto,
    productId: string,
  ): Promise<string> {
    await this.productModel.updateOne({ _id: productId }, body);
    return 'Data updated successfully';
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<string> {
    await this.productModel.findByIdAndDelete(productId);
    return 'Data deleted successfully';
  }
}
