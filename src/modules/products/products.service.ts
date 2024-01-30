import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Get all products
  async getAllProducts(): Promise<string> {
    try {
      const productData = await this.productModel.find().lean();
      return `${JSON.stringify(productData)}`;
    } catch (err) {
      return `"Error in fetching products: ${err.message}"`;
    }
  }

  // Add product data
  async addProducts(
    name: string,
    description: string,
    price: number,
  ): Promise<string> {
    try {
      await this.productModel.create({ name, description, price });
      console.log('data');

      return 'Data added successfully';
    } catch (err) {
      return `"Error in data creation: ${err.message}"`;
    }
  }

  // Update product data
  async updateProduct(
    name: string,
    description: string,
    price: number,
    productId: string,
  ): Promise<string> {
    try {
      await this.productModel.updateOne(
        { _id: productId },
        { name, description, price },
      );
      return 'Data updated successfully';
    } catch (err) {
      return `"Error in updating data: ${err.message}"`;
    }
  }

  // Delete a product
  async deleteProduct(productId: string): Promise<string> {
    try {
      await this.productModel.findByIdAndDelete(productId);
      return 'Data deleted successfully';
    } catch (err) {
      return `"Error in deleting data: ${err.message}"`;
    }
  }
}
